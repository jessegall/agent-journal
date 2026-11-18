<?php

declare(strict_types=1);

namespace App\Skills\Values;

/**
 * A skill left out of a selection, with the safe reason code that left it out.
 */
final readonly class ExcludedSkill
{
    public function __construct(
        public SkillKey $key,
        public string $reason,
    ) {}
}
