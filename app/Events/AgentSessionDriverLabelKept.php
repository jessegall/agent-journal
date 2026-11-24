<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Sessions\AgentSessionEvent;

/**
 * A session kept the label its driver shows.
 */
final readonly class AgentSessionDriverLabelKept extends SessionEvent implements AgentSessionEvent
{
    public function __construct(
        public string $sessionId,
        public string $label,
    ) {}
}
