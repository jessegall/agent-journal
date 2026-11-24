<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\DriverSwitchEvent;

/**
 * A driver switch began to start the replacing session.
 */
final readonly class DriverSwitchStartRequested extends SessionEvent implements DriverSwitchEvent
{
    public function __construct(public string $switchId, public string $sessionId) {}
}
