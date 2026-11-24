<?php

declare(strict_types=1);

namespace App\Events;

/**
 * A generation of skills was retired.
 */
final readonly class SkillGenerationRetired extends SkillEvent
{
    public function __construct(
        public string $generationId,
    ) {}
}
