<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\ActorLabelProvider;
use App\Actors\Contracts\ActorLabels;
use App\Actors\Contracts\ActorProvider;
use App\Actors\Contracts\ActorProviderRegistration;
use App\Actors\Contracts\ActorResolver;
use App\Actors\Contracts\ActorVisibility;
use App\Actors\Contracts\ActorVisibilityProvider;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\WorkStackProvider;
use App\Actors\Contracts\WorkStacks;
use App\Actors\Enums\ActorType;
use App\Actors\Exceptions\ActorProviderRepeated;
use App\Actors\Exceptions\ActorUnavailable;
use App\Actors\Exceptions\CrossOwnerReadRefused;
use Closure;
use Illuminate\Contracts\Container\Container;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * The actor provider of each actor type, registered once at boot; a provider is built per call, so nothing found
 * outlives the request.
 */
final class ActorProviderRegistry implements ActorLabels, ActorProviderRegistration, ActorResolver, ActorVisibility, WorkStacks
{
    /**
     * @var array<string, class-string<ActorProvider>>
     */
    private array $providers = [];

    /**
     * @var array<string, class-string<ActorLabelProvider>>
     */
    private array $labelProviders = [];

    /**
     * @var array<string, class-string<ActorVisibilityProvider>>
     */
    private array $visibilityProviders = [];

    /**
     * @var array<string, class-string<WorkStackProvider>>
     */
    private array $workStackProviders = [];

    public function __construct(private readonly Container $container) {}

    /**
     * @param  class-string<ActorProvider>  $providerClass
     */
    public function register(ActorType $type, string $providerClass): void
    {
        if (array_key_exists($type->value, $this->providers)) {
            throw ActorProviderRepeated::forType($type->value);
        }

        $this->providers[$type->value] = $providerClass;
    }

    /**
     * @param  class-string<ActorLabelProvider>  $providerClass
     */
    public function registerLabels(ActorType $type, string $providerClass): void
    {
        if (array_key_exists($type->value, $this->labelProviders)) {
            throw ActorProviderRepeated::forType($type->value);
        }

        $this->labelProviders[$type->value] = $providerClass;
    }

    /**
     * Asks each type's provider once, for that type's actors; a type with no provider has no labels.
     *
     * @param  list<ActorIdentity>  $actors
     */
    public function labelsFor(array $actors): ActorLabelSet
    {
        $idsByType = [];
        foreach ($actors as $actor) {
            $idsByType[$actor->type->value][$actor->id] = $actor->id;
        }

        $namesByType = [];
        foreach (array_intersect_key($idsByType, $this->labelProviders) as $type => $ids) {
            $provider = $this->container->make($this->labelProviders[$type]);
            $namesByType[$type] = $provider->namesOf(array_values($ids));
        }

        return new ActorLabelSet($namesByType);
    }

    /**
     * @param  class-string<ActorVisibilityProvider>  $providerClass
     */
    public function registerVisibility(ActorType $type, string $providerClass): void
    {
        if (array_key_exists($type->value, $this->visibilityProviders)) {
            throw ActorProviderRepeated::forType($type->value);
        }

        $this->visibilityProviders[$type->value] = $providerClass;
    }

    /**
     * With nobody acting the owner scope refuses the read itself; a type with no provider keeps its own rows.
     *
     * @param  Builder<covariant Model>  $query
     * @param  class-string<Scope<Model>>  $ownerScope
     */
    public function ownRead(Builder $query, string $ownerScope): void
    {
        $actors = $this->container->make(CurrentActor::class);
        if (! $actors->hasActor()) {
            return;
        }

        $providerClass = $this->visibilityProviders[$actors->actor()->actorType()->value] ?? null;
        if ($providerClass !== null) {
            $this->container->make($providerClass)->ownRead($query, $ownerScope);
        }
    }

    /**
     * A type with no provider may not read across owners.
     *
     * @param  Builder<covariant Model>  $query
     * @param  class-string<Scope<Model>>  $ownerScope
     */
    public function readAcrossOwners(Builder $query, string $ownerScope): void
    {
        $type = $this->container->make(CurrentActor::class)->actor()->actorType();
        $providerClass = $this->visibilityProviders[$type->value] ?? throw CrossOwnerReadRefused::forActor(
            $type->value,
        );

        $this->container->make($providerClass)->readAcrossOwners($query, $ownerScope);
    }

    /**
     * With nobody acting the caller's own narrowing applies, which asks its own context; a type with no provider finds
     * nothing.
     *
     * @param  Builder<covariant Model>  $query
     * @param  Closure(Builder<covariant Model>): void  $narrowToOwnRows
     */
    public function ownRows(Builder $query, Closure $narrowToOwnRows): void
    {
        $actors = $this->container->make(CurrentActor::class);
        if (! $actors->hasActor()) {
            $narrowToOwnRows($query);

            return;
        }

        $providerClass = $this->visibilityProviders[$actors->actor()->actorType()->value] ?? null;
        if ($providerClass === null) {
            $query->whereKey([]);

            return;
        }

        $this->container->make($providerClass)->ownRows($query, $narrowToOwnRows);
    }

    /**
     * @param  class-string<WorkStackProvider>  $providerClass
     */
    public function registerWorkStack(ActorType $type, string $providerClass): void
    {
        if (array_key_exists($type->value, $this->workStackProviders)) {
            throw ActorProviderRepeated::forType($type->value);
        }

        $this->workStackProviders[$type->value] = $providerClass;
    }

    /**
     * With nobody acting, or a type that works on no stack, there is nothing to admit.
     *
     * @return list<string>
     */
    public function sessionsToAdmit(): array
    {
        $actors = $this->container->make(CurrentActor::class);
        $type = $actors->hasActor() ? $actors->actor()->actorType()->value : '';
        $providerClass = $this->workStackProviders[$type] ?? null;
        $sessions = $providerClass === null ? [] : $this->container->make($providerClass)->sessionsToAdmit();
        sort($sessions);

        return $sessions;
    }

    public function sessionsOf(ActorIdentity $actor): array
    {
        $providerClass = $this->workStackProviders[$actor->type->value] ?? null;

        return $providerClass === null ? [] : $this->container->make($providerClass)->sessionsOf($actor);
    }

    public function get(ActorIdentity $identity): Actor
    {
        $providerClass = $this->providers[$identity->type->value] ?? throw ActorUnavailable::forIdentity($identity);

        return $this->container->make($providerClass)->actor($identity);
    }
}
