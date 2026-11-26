<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\AgentSessionEvent;

/**
 * A session was handed a generation of skills and the keys of the ones its start gave it.
 */
final readonly class AgentSessionSkillsGenerated implements AgentSessionEvent, SessionEvent
{
    /**
     * @param  list<string>  $skillKeys
     */
    public function __construct(
        public string $sessionId,
        public string $generationId,
        public array $skillKeys,
    ) {}
}
