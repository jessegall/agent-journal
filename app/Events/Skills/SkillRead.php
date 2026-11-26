<?php

declare(strict_types=1);

namespace App\Events\Skills;

use App\Skills\Contracts\SkillSessionEvent;
use App\Skills\Enums\ReadEvidence;

/**
 * A session's agent read a whole skill its start handed it, and the evidence that proved it.
 */
final readonly class SkillRead implements SkillEvent, SkillSessionEvent
{
    public function __construct(
        public string $sessionId,
        public string $skillKey,
        public ReadEvidence $evidence,
    ) {}
}
