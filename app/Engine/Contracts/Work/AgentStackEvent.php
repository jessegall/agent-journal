<?php

declare(strict_types=1);

namespace App\Engine\Contracts\Work;

use App\Contracts\Events\Event;

/**
 * A change to a agent stack: every event of it implements this, so a listener typed on it receives them all.
 */
interface AgentStackEvent extends Event
{
    public string $stackId { get; }
}
