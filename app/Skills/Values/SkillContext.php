<?php

declare(strict_types=1);

namespace App\Skills\Values;

use App\Actors\Support\ActorIdentity;
use App\Actors\Values\AbilityRequirement;
use App\Programs\Values\ProgramKey;
use App\Programs\Values\ProviderKey;

/**
 * The facts every skill condition of one boundary reads: who acts, its session, environment, start profile with what
 * it grants, program and provider. A program or provider the start does not resolve is null, and the
 * conditions that need it answer unavailable. It holds no token or secret.
 */
final readonly class SkillContext
{
    public function __construct(
        public ActorIdentity $actor,
        public string $sessionId,
        public string $environment,
        public StartProfile $profile,
        public ProgramKey|null $program,
        public ProviderKey|null $provider,
    ) {}

    /**
     * Whether the profile this session is pinned to grants the requirement; the caller's rights never count.
     */
    public function grants(AbilityRequirement $requirement): bool
    {
        return $this->profile->grants($requirement);
    }

    /**
     * @return list<string>
     */
    public function requiredSkills(): array
    {
        return $this->profile->requiredSkills();
    }
}
