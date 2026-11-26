<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\DriverSwitchEvent;

/**
 * The session a switch replaces is proven stopped, so its replacement may start. Raised after the commit.
 */
final readonly class DriverSwitchStopped implements DriverSwitchEvent, SessionEvent
{
    public function __construct(public string $switchId) {}
}
