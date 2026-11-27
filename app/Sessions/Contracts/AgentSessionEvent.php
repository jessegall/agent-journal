<?php

declare(strict_types=1);

namespace App\Sessions\Contracts;

use App\Contracts\Events\Event;

/**
 * A change to a agent session: every event of it implements this, so a listener typed on it receives them all.
 */
interface AgentSessionEvent extends SessionFact
{
    public string $sessionId { get; }
}
