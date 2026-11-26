<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Contracts;

use App\Contracts\Events\Event;

/**
 * A change to a terminal view: every event of it implements this, so a listener typed on it receives them all.
 */
interface TerminalViewEvent extends Event
{
    public string $viewId { get; }
}
