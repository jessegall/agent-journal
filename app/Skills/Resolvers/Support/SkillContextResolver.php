<?php

declare(strict_types=1);

namespace App\Skills\Resolvers\Support;

use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\StartDriver;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Sessions\Contracts\AgentResolver;
use App\Sessions\Contracts\CurrentSession;
use App\Sessions\Contracts\ProfileResolver;
use App\Skills\Exceptions\SkillAgentHidden;
use App\Skills\Exceptions\SkillContextUnavailable;
use App\Skills\Values\SkillContext;
use App\Skills\Values\StartProfile;
use App\Support\ActorReference;
use App\Values\ProfileKey;

/**
 * Reads the facts skill conditions decide on for one agent's session: the profile revision it was started with,
 * its driver and provider. It reads no token or secret.
 */
final readonly class SkillContextResolver
{
    /**
     * Version 6 runs one environment per installation.
     */
    public const string ENVIRONMENT = 'main';

    public function __construct(
        private CurrentSession $session,
        private AgentResolver $agents,
        private ProfileResolver $profiles,
        private DriverCatalogue $drivers,
    ) {}

    /**
     * The context of the agent calling in this request.
     *
     * @throws SkillContextUnavailable
     */
    public function current(): SkillContext
    {
        $session = AgentSession::findById($this->session->sessionId());

        $agent = Agent::query()->whereKey($session->agent_id)->firstOrFail();

        return $this->contextOf(
            $agent,
            $session,
            $this->profileOf($session),
        );
    }

    /**
     * The agents of the list that the actor of this request may see, in the list's order.
     *
     * @param  list<Agent>  $agents
     * @return list<Agent>
     */
    public function visible(array $agents): array
    {
        $labels = $this->agents->labelsFor(array_map(fn (Agent $agent) => $agent->id, $agents));

        return array_values(array_filter($agents, fn (Agent $agent) => isset($labels[$agent->id])));
    }

    /**
     * The context of an agent's latest session, for a preview by an actor who may see that agent.
     *
     * @throws SkillAgentHidden
     * @throws SkillContextUnavailable
     */
    public function forAgent(Agent $agent): SkillContext
    {
        if ($this->agents->labelsFor([$agent->id]) === []) {
            throw SkillAgentHidden::for();
        }

        $session = AgentSession::findLatestOf($agent->id) ?? throw SkillContextUnavailable::neverStarted($agent->id);

        return $this->contextOf($agent, $session, $this->profileOf($session));
    }

    /**
     * The context of one session, for trusted Core work such as a refresh run by the system actor.
     *
     * @throws SkillContextUnavailable
     */
    public function forSession(AgentSession $session): SkillContext
    {
        $agent = Agent::query()->whereKey($session->agent_id)->firstOrFail();

        return $this->contextOf(
            $agent,
            $session,
            $this->profileOf($session),
        );
    }

    private function contextOf(Agent $agent, AgentSession $session, StartProfile $profile): SkillContext
    {
        $driver = StartDriver::of($session->driver_key, $this->drivers);

        return new SkillContext(
            actor: ActorReference::ofClass(Agent::class, $agent->id),
            sessionId: $session->id,
            environment: self::ENVIRONMENT,
            profile: $profile,
            driver: $driver->driver,
            provider: $driver->provider,
        );
    }

    /**
     * The profile revision the session was pinned to; sessions pinned alike share one read.
     */
    private function profileOf(AgentSession $session): StartProfile
    {
        return StartProfile::of($this->profiles->snapshotAt(
            ProfileKey::from($session->profile_key),
            $session->profile_revision,
        ));
    }
}
