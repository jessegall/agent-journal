<?php

declare(strict_types=1);

namespace App\Supervision\Support;

use App\Actors\Support\ActorIdentity;
use App\Agents\Models\Agent;
use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Contracts\SupervisorDefinitions;
use App\Profiles\Exceptions\SupervisorRouteInvalid;
use App\Profiles\Values\AskTypeKey;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\SupervisorProfile;
use App\Profiles\Values\SupervisorRoutes;
use App\Profiles\Values\SupervisorTarget;
use App\Supervision\Commands\ChangeSupervisor;
use App\Supervision\Contracts\AskType;
use App\Supervision\Exceptions\SupervisorRouteRefused;
use App\Supervision\Models\Ask;
use App\Supervision\Models\SupervisorChange;
use App\Supervision\Models\SupervisorLink;
use App\Supervision\Values\SupervisorChangeReceipt;
use App\Supervision\Values\SupervisorRoute;

final readonly class SupervisorRouting implements SupervisorDefinitions
{
    public function __construct(
        private SupervisorGraphLock $lock,
        private ProfileResolver $profiles,
        private SupervisorCoverageReader $coverage,
        private AskTypeRegistry $types,
    ) {}

    public function validate(array $proposed): array
    {
        $this->lock->acquire();
        $profiles = $this->profileRoutes($proposed);
        $coverage = [];

        foreach ($proposed as $profile) {
            $this->requireKnown($profile->routes, $profiles);
            $coverage[$profile->key->key] = $this->coverage->forRoutes($profile->routes, $profiles);
        }

        $this->requireAcyclic($profiles, SupervisorLink::graphRoutes());

        return $coverage;
    }

    public function change(ChangeSupervisor $command, ActorIdentity $author): SupervisorChangeReceipt
    {
        $this->lock->acquire();
        $actor = $this->workingActor($command->actor);
        $profile = $this->profiles->snapshotFor(ProfileKey::from($actor->profile_key));
        $link = SupervisorLink::ofActor($command->actor, $profile->supervisor);
        $type = $command->type;
        $version = $link->versionFor($type);

        if ($version !== $command->expectedVersion) {
            throw SupervisorRouteRefused::stale($command->expectedVersion, $version);
        }

        $old = $link->routes;
        $routes = $type === null ? $old->withDefault($command->target) : $old->withOverride($type, $command->target);
        $profiles = $this->profileRoutes([]);
        $this->requireKnown($routes, $profiles);

        $this->requireAcyclic(
            $profiles,
            [...SupervisorLink::graphRoutes(), SupervisorTarget::forActor($command->actor)->key => $routes],
        );

        $link->change($routes, $type);

        SupervisorChange::create(
            $link,
            $author,
            $type,
            $type === null ? $old->default : $old->targetFor($type),
            $command->target,
        );

        return new SupervisorChangeReceipt($link->versionFor($type), $this->coverage->forRoutes($routes, $profiles));
    }

    public function routeFor(ActorIdentity $requester, AskTypeKey $type): SupervisorRoute
    {
        $this->types->get($type);
        $actor = $this->workingActor($requester);
        $profile = $this->profiles->snapshotFor(ProfileKey::from($actor->profile_key));
        $link = SupervisorLink::ofActor($requester, $profile->supervisor);

        return new SupervisorRoute($link->routes->targetFor($type), $link->versionFor($type));
    }

    /**
     * The route an ask follows: the route of the profile it was opened on, such as a merge that follows the role a
     * review was first sent to, else its requester's own.
     */
    public function routeOf(Ask $ask): SupervisorRoute
    {
        return $ask->route_profile === null
            ? $this->routeFor($ask->actor(), $ask->typeKey())
            : $this->routeForProfile(ProfileKey::from($ask->route_profile), $ask->typeKey());
    }

    /**
     * The route a profile's own definition gives an ask type, whatever actor of it or after it asks.
     */
    public function routeForProfile(ProfileKey $key, AskTypeKey $type): SupervisorRoute
    {
        $this->types->get($type);

        return new SupervisorRoute($this->profiles->snapshotFor($key)->supervisorTargetFor($type), 0);
    }

    private function workingActor(ActorIdentity $actor): Agent
    {
        if (! $actor->type->isAgent()) {
            throw SupervisorRouteRefused::actorUnavailable();
        }

        $agent = Agent::byIds([$actor->id])[$actor->id] ?? null;

        if ($agent === null || $agent->isRetired()) {
            throw SupervisorRouteRefused::actorUnavailable();
        }

        return $agent;
    }

    /**
     * @param  list<SupervisorProfile>  $proposed
     * @return array<string, SupervisorProfile>
     */
    private function profileRoutes(array $proposed): array
    {
        $profiles = [];

        foreach ([...$this->profiles->supervisorProfiles(), ...$proposed] as $profile) {
            $profiles[SupervisorTarget::forProfile($profile->key)->key] = $profile;
        }

        return $profiles;
    }

    /**
     * @param  array<string, SupervisorProfile>  $profiles
     */
    private function requireKnown(SupervisorRoutes $routes, array $profiles): void
    {
        foreach ($routes->overrides as $override) {
            $this->types->get($override->type);
        }

        foreach ($routes->jsonSerialize() as $target) {
            $parsed = SupervisorTarget::parse($target);

            if ($parsed->isProfile() && ! isset($profiles[$target])) {
                throw SupervisorRouteInvalid::unknownProfile($target);
            }
        }
    }

    /**
     * @param  array<string, SupervisorProfile>  $profiles
     * @param  array<string, SupervisorRoutes>  $actors
     */
    private function requireAcyclic(array $profiles, array $actors): void
    {
        $routes = [...array_map(fn (SupervisorProfile $profile) => $profile->routes, $profiles), ...$actors];
        $types = array_map(fn (AskType $type): AskTypeKey => $type->key(), $this->types->all());

        new SupervisorGraph($routes)->requireAcyclic($types);
    }
}
