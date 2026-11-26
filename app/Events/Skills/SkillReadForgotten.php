<?php

declare(strict_types=1);

namespace App\Events\Skills;

/**
 * A read of a skill was forgotten, because its agent's session started afresh.
 */
final readonly class SkillReadForgotten implements SkillEvent
{
    public function __construct(
        public string $sessionId,
        public string $skillKey,
    ) {}
}
