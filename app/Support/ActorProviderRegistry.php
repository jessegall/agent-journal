<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Contracts\Actors\ActorLabelProvider;
use App\Contracts\Actors\ActorLabels;
use App\Contracts\Actors\ActorProvider;
use App\Contracts\Actors\ActorProviderRegistration;
use App\Contracts\Actors\ActorResolver;
use App\Contracts\Actors\ActorTypes;
use App\Contracts\Actors\ActorVisibility;
use App\Contracts\Actors\ActorVisibilityProvider;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Actors\RecipientActor;
use App\Contracts\Actors\StoredActor;
use App\Contracts\Work\ActorStackSessionProvider;
use App\Contracts\Work\ActorStackSessions;
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
    ActorStackSessions,
    ActorTypes,
    ActorVisibility
{
    /**
     * @var array<string, class-string<StoredActor>>
     */
    private array $actorClasses = [];

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
     * @var Registry<class-string<ActorStackSessionProvider>>
     */
    private readonly Registry $stackSessionProviders;

    public function __construct()
    {
        $this->providers = Registry::once(ActorProviderMissing::forType(...), ActorProviderRepeated::forType(...));
        $this->labelProviders = Registry::once(ActorProviderMissing::forType(...), ActorProviderRepeated::forType(...));

        $this->visibilityProviders = Registry::once(
            CrossOwnerReadRefused::forActor(...),
            ActorProviderRepeated::forType(...),
        );

        $this->stackSessionProviders = Registry::once(
            ActorProviderMissing::forType(...),
            ActorProviderRepeated::forType(...),
        );
    }

    /**
     * @param  class-string<StoredActor>  $actorClass
     * @param  class-string<ActorProvider>  $class
     */
    public function register(string $actorClass, string $class): void
    {
        $type = $actorClass::storedType();
        $this->providers->put($type, $class);
        $this->actorClasses[$type] = $actorClass;
    }

    public function types(): array
    {
        return array_map(strval(...), array_keys($this->actorClasses));
    }

    public function requestTypes(): array
    {
        $types = array_keys(array_filter(
            $this->actorClasses,
            fn (string $actorClass) => ReflectedType::of($actorClass)->implements(RecipientActor::class),
        ));

        return array_map(strval(...), $types);
    }

    /**
     * @param  class-string<StoredActor>  $actorClass
     * @param  class-string<ActorLabelProvider>  $class
     */
    public function registerLabels(string $actorClass, string $class): void
    {
        $this->labelProviders->put($actorClass::storedType(), $class);
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
            $idsByType[$actor->type][$actor->id] = $actor->id;
        }

        $namesByType = [];

        foreach (array_intersect_key($idsByType, $this->labelProviders->all()) as $type => $ids) {
            $provider = Container::getInstance()->make($this->labelProviders->get($type));
            $namesByType[$type] = $provider->namesOf(array_values($ids));
        }

        return new ActorLabelSet($namesByType);
    }

    /**
     * @param  class-string<StoredActor>  $actorClass
     * @param  class-string<ActorVisibilityProvider>  $class
     */
    public function registerVisibility(string $actorClass, string $class): void
    {
        $this->visibilityProviders->put($actorClass::storedType(), $class);
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

        $type = $actors->actor()->actorType();

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
        $providerClass = $this->visibilityProviders->get($type);

        Container::getInstance()->make($providerClass)->readAcrossOwners($query, $scope);
    }

    public function canReadAcrossOwners(): bool
    {
        $type = Container::getInstance()->make(CurrentActor::class)->actor()->actorType();

        return Container::getInstance()->make($this->visibilityProviders->get($type))->canReadAcrossOwners();
    }

    /**
     * With nobody acting the caller's own narrowing applies, which asks its own context; a type with no provider finds
     * nothing.
     *
     * @param  Builder<covariant Model>  $query
     * @param  Closure(Builder<covariant Model>): void  $scope
     */
    public function ownRows(Builder $query, Closure $scope): void
    {
        $actors = Container::getInstance()->make(CurrentActor::class);

        if (! $actors->hasActor()) {
            $scope($query);

            return;
        }

        $type = $actors->actor()->actorType();

        if (! $this->visibilityProviders->has($type)) {
            $query->whereKey([]);

            return;
        }

        Container::getInstance()->make($this->visibilityProviders->get($type))->ownRows($query, $scope);
    }

    /**
     * @param  class-string<StoredActor>  $actorClass
     * @param  class-string<ActorStackSessionProvider>  $class
     */
    public function registerStackSessions(string $actorClass, string $class): void
    {
        $this->stackSessionProviders->put($actorClass::storedType(), $class);
    }

    /**
     * With nobody acting, or a type that works on no stack, there is nothing to admit.
     *
     * @return list<string>
     */
    public function admittableSessions(): array
    {
        $actors = Container::getInstance()->make(CurrentActor::class);

        if (! $actors->hasActor()) {
            return [];
        }

        $sessions = $this->stackSessionsOf($actors->actor()->actorType())
            ->map(fn (ActorStackSessionProvider $provider) => $provider->admittableSessions())
            ->getOrElse([]);

        sort($sessions);

        return $sessions;
    }

    public function sessionsOf(ActorIdentity $actor): array
    {
        return $this->stackSessionsOf($actor->type)
            ->map(fn (ActorStackSessionProvider $provider) => $provider->sessionsOf($actor))
            ->getOrElse([]);
    }

    public function get(ActorIdentity $identity): Actor
    {
        $providerClass = $this->providers->find($identity->type)
            ->getOrThrow(ActorUnavailable::forIdentity($identity));

        return Container::getInstance()->make($providerClass)->actor($identity);
    }

    /**
     * The stack session provider of the actor type, built for this call; a type that works on no stack has none.
     *
     * @return Option<ActorStackSessionProvider>
     */
    private function stackSessionsOf(string $type): Option
    {
        return $this->stackSessionProviders->find($type)
            ->map(fn (string $providerClass) => Container::getInstance()->make($providerClass));
    }
}
