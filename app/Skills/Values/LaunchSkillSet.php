<?php

declare(strict_types=1);

namespace App\Skills\Values;

/**
 * The skills selected for one session's launch, with the working folder the session runs in.
 */
final readonly class LaunchSkillSet
{
    /**
     * @param  list<PublishedSkill>  $skills
     */
    public function __construct(
        public string $sessionId,
        public string $workingFolder,
        public array $skills,
    ) {}
}
