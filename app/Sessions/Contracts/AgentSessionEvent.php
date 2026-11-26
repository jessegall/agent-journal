<?php

declare(strict_types=1);

namespace App\Sessions\Contracts;

use App\Contracts\Events\Event;

/**
 * A change to a agent session: every event of it implements this, so a listener typed on it hears them all.
 */
interface AgentSessionEvent extends Event
{
    public string $sessionId { get; }
}
