<?php

declare(strict_types=1);

namespace App\Events\Skills;

/**
 * A generation of skills was retired.
 */
final readonly class SkillGenerationRetired implements SkillEvent
{
    public function __construct(
        public string $generationId,
    ) {}
}
