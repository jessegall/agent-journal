<?php

declare(strict_types=1);

namespace App\Skills\Values;

use App\Actors\Support\ActorIdentity;
use App\Agents\Enums\AgentRole;
use App\Programs\Values\ProgramKey;
use App\Programs\Values\ProviderKey;

/**
 * The facts every skill condition of one boundary reads: who acts, the agent's trusted role, its session, environment,
 * launch profile, program and provider. A program or provider the launch does not resolve is null, and the
 * conditions that need it answer unavailable. It holds no token or secret.
 */
final readonly class SkillContext
{
    public function __construct(
        public ActorIdentity $actor,
        public AgentRole $agentRole,
        public string $sessionId,
        public string $environment,
        public LaunchProfile $profile,
        public ProgramKey|null $program,
        public ProviderKey|null $provider,
    ) {}

    /**
     * @return list<string>
     */
    public function requiredSkills(): array
    {
        return $this->profile->requiredSkills();
    }
}
