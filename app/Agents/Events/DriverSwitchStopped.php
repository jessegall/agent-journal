<?php

declare(strict_types=1);

namespace App\Agents\Events;

use App\Contracts\Event;

/**
 * The session a switch replaces is proven stopped, so its replacement may start. Raised after the commit.
 */
final readonly class DriverSwitchStopped implements Event
{
    public function __construct(public string $switchId) {}
}
