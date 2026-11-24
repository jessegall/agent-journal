<?php

declare(strict_types=1);

namespace App\Events;

/**
 * The session a switch replaces is proven stopped, so its replacement may start. Raised after the commit.
 */
final readonly class DriverSwitchStopped extends SessionEvent
{
    public function __construct(public string $switchId) {}
}
