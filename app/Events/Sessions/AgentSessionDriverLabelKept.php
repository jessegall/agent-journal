<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Sessions\Contracts\AgentSessionEvent;

/**
 * A session kept the label its driver shows.
 */
final readonly class AgentSessionDriverLabelKept implements AgentSessionEvent, SessionEvent
{
    public function __construct(
        public string $sessionId,
        public string $label,
    ) {}
}
