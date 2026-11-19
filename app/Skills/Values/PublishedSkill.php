<?php

declare(strict_types=1);

namespace App\Skills\Values;

/**
 * A skill delivered to a start: its key, the digest of its text and the absolute path of its SKILL.md.
 */
final readonly class PublishedSkill
{
    public function __construct(
        public SkillKey $key,
        public string $digest,
        public string $path,
    ) {}
}
