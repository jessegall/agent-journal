<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\DriverSwitchEvent;

/**
 * A driver switch began to stop the session it replaces.
 */
final readonly class DriverSwitchStopRequested implements DriverSwitchEvent, SessionEvent
{
    public function __construct(public string $switchId) {}
}
