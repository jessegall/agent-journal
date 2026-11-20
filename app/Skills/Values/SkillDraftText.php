<?php

declare(strict_types=1);

namespace App\Skills\Values;

/** The text a caller submits for a new skill. */
final readonly class SkillDraftText
{
    public function __construct(
        public string $name,
        public string $description,
        public string $body,
        public string $condition,
    ) {}
}
