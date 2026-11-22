<?php

declare(strict_types=1);

namespace App\Values;

/**
 * What a stored skill write saved: the skill's id and number and the revision it appended. Publication is still
 * pending; nothing says an agent has read it.
 */
final readonly class SkillRevisionResult
{
    public function __construct(
        public string $skillId,
        public int $number,
        public int $revision,
        public bool $publicationPending,
        public string $requestId,
    ) {}
}
