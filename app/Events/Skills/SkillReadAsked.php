<?php

declare(strict_types=1);

namespace App\Events\Skills;

use App\Skills\Contracts\SkillSessionEvent;

/**
 * A session's agent was asked to read these skills whole.
 */
final readonly class SkillReadAsked implements SkillEvent, SkillSessionEvent
{
    /**
     * @param  list<string>  $skillKeys
     */
    public function __construct(
        public string $sessionId,
        public array $skillKeys,
    ) {}
}
