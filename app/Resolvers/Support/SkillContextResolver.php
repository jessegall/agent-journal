<?php

declare(strict_types=1);

namespace App\Resolvers\Support;

use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Sessions\AgentResolver;
use App\Contracts\Sessions\CurrentSession;
use App\Contracts\Sessions\ProfileResolver;
use App\Enums\Assignments\ActorType;
use App\Exceptions\SkillAgentHidden;
use App\Exceptions\SkillContextUnavailable;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Support\ActorIdentity;
use App\Support\StartDriver;
use App\Values\ProfileKey;
use App\Values\SkillContext;
use App\Values\StartProfile;

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
        $session = AgentSession::byId($this->session->sessionId());

        return $this->contextOf(
            Agent::query()->whereKey($session->agent_id)->firstOrFail(),
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

        $session = AgentSession::latestOf($agent->id) ?? throw SkillContextUnavailable::neverStarted($agent->id);

        return $this->contextOf($agent, $session, $this->profileOf($session));
    }

    /**
     * The context of one session, for trusted Core work such as a refresh run by the system actor.
     *
     * @throws SkillContextUnavailable
     */
    public function forSession(AgentSession $session): SkillContext
    {
        return $this->contextOf(
            Agent::query()->whereKey($session->agent_id)->firstOrFail(),
            $session,
            $this->profileOf($session),
        );
    }

    /**
     * The context of each of these sessions, by session id, reading their agents in one query, for trusted Core work
     * such as a refresh; a session whose context is unavailable, such as a helper started without a profile, is
     * left out, as it gets no selection of its own.
     *
     * @param  list<AgentSession>  $sessions
     * @return array<string, SkillContext>
     */
    public function forSessions(array $sessions): array
    {
        $agentIds = array_map(fn (AgentSession $session) => $session->agent_id, $sessions);
        $agents = Agent::byIds(array_values(array_unique($agentIds)));
        $profiles = [];
        $contexts = [];

        foreach ($sessions as $session) {
            $pin = "{$session->profile_key}#{$session->profile_revision}";
            $profiles[$pin] ??= $this->profileOf($session);

            try {
                $contexts[$session->id] = $this->contextOf($agents[$session->agent_id], $session, $profiles[$pin]);
            } catch (SkillContextUnavailable) {
                continue;
            }
        }

        return $contexts;
    }

    private function contextOf(Agent $agent, AgentSession $session, StartProfile $profile): SkillContext
    {
        $driver = StartDriver::of($session->driver_key, $this->drivers);

        return new SkillContext(
            actor: new ActorIdentity(ActorType::Agent, $agent->id),
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
