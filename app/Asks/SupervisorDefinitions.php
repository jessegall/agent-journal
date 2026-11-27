<?php

declare(strict_types=1);

namespace App\Asks;

use App\Agents\Commands\ChangeSupervisor\ChangeSupervisorCommand;
use App\Agents\Values\SupervisorChangeReceipt;
use App\Asks\Contracts\AskType;
use App\Asks\Exceptions\SupervisorRouteRefused;
use App\Asks\Values\SupervisorRoute;
use App\Exceptions\SupervisorRouteInvalid;
use App\Models\Agents\Agent;
use App\Models\Asks\Ask;
use App\Models\Asks\SupervisorChange;
use App\Models\Asks\SupervisorLink;
use App\Processes\Contracts\SupervisorDefinitions as SupervisorDefinitionsContract;
use App\Sessions\Contracts\ProfileResolver;
use App\Support\ActorReference;
use App\Values\AskTypeKey;
use App\Values\ProfileKey;
use App\Values\SupervisorProfile;
use App\Values\SupervisorRoutes;
use App\Values\SupervisorTarget;

final readonly class SupervisorDefinitions implements SupervisorDefinitionsContract
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

        $this->requireAcyclic($profiles, SupervisorLink::resolveGraphRoutes());

        return $coverage;
    }

    public function change(ChangeSupervisorCommand $command): SupervisorChangeReceipt
    {
        $author = $command->dispatchedBy();
        $this->lock->acquire();
        $actor = $this->workingActor($command->actor);
        $profile = $this->profiles->snapshotFor(ProfileKey::from($actor->profile_key));
        $link = SupervisorLink::create($command->actor, $profile->supervisor);
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
            [...SupervisorLink::resolveGraphRoutes(), SupervisorTarget::forActor($command->actor)->key => $routes],
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

    public function routeFor(ActorReference $requester, AskTypeKey $type): SupervisorRoute
    {
        $this->types->get($type);
        $actor = $this->workingActor($requester);
        $profile = $this->profiles->snapshotFor(ProfileKey::from($actor->profile_key));
        $link = SupervisorLink::create($requester, $profile->supervisor);

        return new SupervisorRoute($link->routes->targetFor($type), $link->versionFor($type));
    }

    /**
     * The route an ask follows: the route of the profile it was opened on, such as a merge that follows the role a
     * review was first sent to, else its requester's own.
     */
    public function routeOf(Ask $ask): SupervisorRoute
    {
        if ($ask->route_profile === null) {
            return $this->routeFor($ask->actor(), $ask->type_key);
        }

        return $this->routeForProfile(ProfileKey::from($ask->route_profile), $ask->type_key);
    }

    /**
     * The route a profile's own definition gives an ask type, whatever actor of it or after it asks.
     */
    public function routeForProfile(ProfileKey $key, AskTypeKey $type): SupervisorRoute
    {
        $this->types->get($type);

        return new SupervisorRoute($this->profiles->snapshotFor($key)->supervisorTargetFor($type), 0);
    }

    private function workingActor(ActorReference $actor): Agent
    {
        if (! $actor->isAgent()) {
            throw SupervisorRouteRefused::actorUnavailable();
        }

        $agent = Agent::findByIds([$actor->id])[$actor->id] ?? null;

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

        foreach ([
            ...$this->profiles->supervisorProfiles(),
            ...$proposed,
        ] as $profile) {
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

        foreach ($routes->targets() as $target) {
            if ($target->isProfile() && ! isset($profiles[$target->key])) {
                throw SupervisorRouteInvalid::unknownProfile($target->key);
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
        $types = array_map(fn (AskType $type) => $type->key(), $this->types->all());

        new SupervisorGraph($routes)->requireAcyclic($types);
    }
}
