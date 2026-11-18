<?php

declare(strict_types=1);

namespace App\Skills\Readers\Support;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\AgentReader;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Enums\AgentRole;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Profiles\Contracts\ProfileReader;
use App\Profiles\Values\ProfileKey;
use App\Skills\Exceptions\SkillAgentHidden;
use App\Skills\Exceptions\SkillContextUnavailable;
use App\Skills\Support\LaunchProgram;
use App\Skills\Values\LaunchProfile;
use App\Skills\Values\SkillContext;

/**
 * Reads the facts skill conditions decide on for one agent's session: its trusted role, the profile revision it was
 * launched with, its program and provider. It reads no token or secret.
 */
final readonly class SkillContextReader
{
    /**
     * Version 6 runs one environment per installation.
     */
    public const string ENVIRONMENT = 'main';

    public function __construct(
        private CurrentSession $session,
        private AgentReader $agents,
        private ProfileReader $profiles,
    ) {}

    /**
     * The context of the agent calling in this request.
     *
     * @throws SkillContextUnavailable
     */
    public function current(): SkillContext
    {
        $session = AgentSession::byId($this->session->sessionId());

        return $this->contextOf(Agent::query()->whereKey($session->agent_id)->firstOrFail(), $session);
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

        $session = AgentSession::latestOf($agent->id) ?? throw SkillContextUnavailable::neverLaunched($agent->id);

        return $this->contextOf($agent, $session);
    }

    /**
     * The context of one session, for trusted Core work such as a refresh run by the system actor.
     *
     * @throws SkillContextUnavailable
     */
    public function forSession(AgentSession $session): SkillContext
    {
        return $this->contextOf(Agent::query()->whereKey($session->agent_id)->firstOrFail(), $session);
    }

    /**
     * The context of each of these sessions, by session id, reading their agents in one query, for trusted Core work
     * such as a refresh; a session whose context is unavailable, such as a helper launched without a profile, is
     * left out, as it gets no selection of its own.
     *
     * @param  list<AgentSession>  $sessions
     * @return array<string, SkillContext>
     */
    public function forSessions(array $sessions): array
    {
        $agentIds = array_map(fn (AgentSession $session) => $session->agent_id, $sessions);
        $agents = Agent::byIds(array_values(array_unique($agentIds)));
        $contexts = [];

        foreach ($sessions as $session) {
            try {
                $contexts[$session->id] = $this->contextOf($agents[$session->agent_id], $session);
            } catch (SkillContextUnavailable) {
                continue;
            }
        }

        return $contexts;
    }

    private function contextOf(Agent $agent, AgentSession $session): SkillContext
    {
        $program = LaunchProgram::of($session->program);

        return new SkillContext(
            actor: new ActorIdentity(ActorType::Agent, $agent->id),
            agentRole: $agent->agentRole(),
            sessionId: $session->id,
            environment: self::ENVIRONMENT,
            profile: $this->profileOf($agent, $session),
            program: $program->program,
            provider: $program->provider,
        );
    }

    /**
     * @throws SkillContextUnavailable when a helper was launched without a profile
     */
    private function profileOf(Agent $agent, AgentSession $session): LaunchProfile
    {
        if ($session->profile_key === null || $session->profile_revision === null) {
            return $this->profileFreeFor($agent);
        }

        return LaunchProfile::of($this->profiles->snapshotAt(
            ProfileKey::from($session->profile_key),
            $session->profile_revision,
        ));
    }

    /**
     * @throws SkillContextUnavailable when a helper was launched without a profile
     */
    private function profileFreeFor(Agent $agent): LaunchProfile
    {
        if ($agent->agentRole() !== AgentRole::MainAgent) {
            throw SkillContextUnavailable::profileRequired($agent->id);
        }

        return LaunchProfile::profileFree();
    }
}
