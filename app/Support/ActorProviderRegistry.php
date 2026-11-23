<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Contracts\Actors\ActorLabelProvider;
use App\Contracts\Actors\ActorLabels;
use App\Contracts\Actors\ActorProvider;
use App\Contracts\Actors\ActorProviderRegistration;
use App\Contracts\Actors\ActorResolver;
use App\Contracts\Actors\ActorVisibility;
use App\Contracts\Actors\ActorVisibilityProvider;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Work\WorkStackProvider;
use App\Contracts\Work\WorkStacks;
use App\Enums\ActorType;
use App\Exceptions\ActorProviderMissing;
use App\Exceptions\ActorProviderRepeated;
use App\Exceptions\ActorUnavailable;
use App\Exceptions\CrossOwnerReadRefused;
use Closure;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use PhpOption\Option;

/**
 * The actor provider of each actor type, registered once at boot; a provider is built per call, from the asking
 * request's container, so nothing found outlives the request.
 */
final class ActorProviderRegistry implements
    ActorLabels,
    ActorProviderRegistration,
    ActorResolver,
    ActorVisibility,
    WorkStacks
{
    /**
     * @var Registry<class-string<ActorProvider>>
     */
    private readonly Registry $providers;

    /**
     * @var Registry<class-string<ActorLabelProvider>>
     */
    private readonly Registry $labelProviders;

    /**
     * @var Registry<class-string<ActorVisibilityProvider>>
     */
    private readonly Registry $visibilityProviders;

    /**
     * @var Registry<class-string<WorkStackProvider>>
     */
    private readonly Registry $workStackProviders;

    public function __construct()
    {
        $this->providers = Registry::once(ActorProviderMissing::forType(...), ActorProviderRepeated::forType(...));
        $this->labelProviders = Registry::once(ActorProviderMissing::forType(...), ActorProviderRepeated::forType(...));

        $this->visibilityProviders = Registry::once(
            CrossOwnerReadRefused::forActor(...),
            ActorProviderRepeated::forType(...),
        );

        $this->workStackProviders = Registry::once(
            ActorProviderMissing::forType(...),
            ActorProviderRepeated::forType(...),
        );
    }

    /**
     * @param  class-string<ActorProvider>  $class
     */
    public function register(ActorType $type, string $class): void
    {
        $this->providers->put($type->value, $class);
    }

    /**
     * @param  class-string<ActorLabelProvider>  $class
     */
    public function registerLabels(ActorType $type, string $class): void
    {
        $this->labelProviders->put($type->value, $class);
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

        foreach (array_intersect_key($idsByType, $this->labelProviders->all()) as $type => $ids) {
            $provider = Container::getInstance()->make($this->labelProviders->get($type));
            $namesByType[$type] = $provider->namesOf(array_values($ids));
        }

        return new ActorLabelSet($namesByType);
    }

    /**
     * @param  class-string<ActorVisibilityProvider>  $class
     */
    public function registerVisibility(ActorType $type, string $class): void
    {
        $this->visibilityProviders->put($type->value, $class);
    }

    /**
     * With nobody acting the owner scope refuses the read itself; a type with no provider keeps its own rows.
     *
     * @param  Builder<covariant Model>  $query
     * @param  class-string<Scope<Model>>  $ownerScope
     */
    public function ownRead(Builder $query, string $ownerScope): void
    {
        $actors = Container::getInstance()->make(CurrentActor::class);

        if (! $actors->hasActor()) {
            return;
        }

        $type = $actors->actor()->actorType()->value;

        if ($this->visibilityProviders->has($type)) {
            Container::getInstance()->make($this->visibilityProviders->get($type))->ownRead($query, $ownerScope);
        }
    }

    /**
     * A type with no provider may not read across owners.
     *
     * @param  Builder<covariant Model>  $query
     * @param  class-string<Scope<Model>>  $scope
     *
     * @throws CrossOwnerReadRefused
     */
    public function readAcrossOwners(Builder $query, string $scope): void
    {
        $type = Container::getInstance()->make(CurrentActor::class)->actor()->actorType();
        $providerClass = $this->visibilityProviders->get($type->value);

        Container::getInstance()->make($providerClass)->readAcrossOwners($query, $scope);
    }

    public function canReadAcrossOwners(): bool
    {
        $type = Container::getInstance()->make(CurrentActor::class)->actor()->actorType();

        return Container::getInstance()->make($this->visibilityProviders->get($type->value))->canReadAcrossOwners();
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
        $actors = Container::getInstance()->make(CurrentActor::class);

        if (! $actors->hasActor()) {
            $narrowToOwnRows($query);

            return;
        }

        $type = $actors->actor()->actorType()->value;

        if (! $this->visibilityProviders->has($type)) {
            $query->whereKey([]);

            return;
        }

        Container::getInstance()->make($this->visibilityProviders->get($type))->ownRows($query, $narrowToOwnRows);
    }

    /**
     * @param  class-string<WorkStackProvider>  $class
     */
    public function registerWorkStack(ActorType $type, string $class): void
    {
        $this->workStackProviders->put($type->value, $class);
    }

    /**
     * With nobody acting, or a type that works on no stack, there is nothing to admit.
     *
     * @return list<string>
     */
    public function sessionsToAdmit(): array
    {
        $actors = Container::getInstance()->make(CurrentActor::class);

        if (! $actors->hasActor()) {
            return [];
        }

        $sessions = $this->workStackOf($actors->actor()->actorType()->value)
            ->map(fn (WorkStackProvider $provider) => $provider->sessionsToAdmit())
            ->getOrElse([]);

        sort($sessions);

        return $sessions;
    }

    public function sessionsOf(ActorIdentity $actor): array
    {
        return $this->workStackOf($actor->type->value)
            ->map(fn (WorkStackProvider $provider) => $provider->sessionsOf($actor))
            ->getOrElse([]);
    }

    public function get(ActorIdentity $identity): Actor
    {
        $providerClass = $this->providers->find($identity->type->value)
            ->getOrThrow(ActorUnavailable::forIdentity($identity));

        return Container::getInstance()->make($providerClass)->actor($identity);
    }

    /**
     * The work stack provider of the actor type, built for this call; a type that works on no stack has none.
     *
     * @return Option<WorkStackProvider>
     */
    private function workStackOf(string $type): Option
    {
        return $this->workStackProviders->find($type)
            ->map(fn (string $providerClass) => Container::getInstance()->make($providerClass));
    }
}
