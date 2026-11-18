<?php

declare(strict_types=1);

namespace App\Skills\Readers;

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
            return $agent->agentRole() === AgentRole::MainAgent ? LaunchProfile::profileFree() : throw SkillContextUnavailable::profileRequired($agent->id);
        }

        return LaunchProfile::of($this->profiles->snapshotAt(ProfileKey::from($session->profile_key), $session->profile_revision));
    }
}
