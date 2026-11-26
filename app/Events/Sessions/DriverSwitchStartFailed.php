<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\DriverSwitchEvent;

/**
 * A driver switch could not start the replacing session, for the reason given.
 */
final readonly class DriverSwitchStartFailed implements DriverSwitchEvent, SessionEvent
{
    public function __construct(public string $switchId, public string $reason) {}
}
