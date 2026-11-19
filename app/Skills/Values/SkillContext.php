<?php

declare(strict_types=1);

namespace App\Skills\Values;

use App\Actors\Support\ActorIdentity;
use App\Programs\Values\ProgramKey;
use App\Programs\Values\ProviderKey;

/**
 * The facts every skill condition of one boundary reads: who acts, its session, environment, launch profile with what
 * it grants, program and provider. A program or provider the launch does not resolve is null, and the
 * conditions that need it answer unavailable. It holds no token or secret.
 */
final readonly class SkillContext
{
    public function __construct(
        public ActorIdentity $actor,
        public string $sessionId,
        public string $environment,
        public LaunchProfile $profile,
        public ProgramKey|null $program,
        public ProviderKey|null $provider,
    ) {}
}
