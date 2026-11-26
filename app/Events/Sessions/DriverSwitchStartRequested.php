<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\DriverSwitchEvent;

/**
 * A driver switch began to start the replacing session.
 */
final readonly class DriverSwitchStartRequested implements DriverSwitchEvent, SessionEvent
{
    public function __construct(public string $switchId, public string $sessionId) {}
}
