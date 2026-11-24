<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Drivers\DriverSwitchEvent;

/**
 * The session a switch replaces is proven stopped, so its replacement may start. Raised after the commit.
 */
final readonly class DriverSwitchStopped extends SessionEvent implements DriverSwitchEvent
{
    public function __construct(public string $switchId) {}
}
