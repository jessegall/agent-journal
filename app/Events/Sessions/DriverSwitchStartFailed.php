<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\DriverSwitchEvent;

/**
 * A driver switch could not start the replacing session, for the reason given.
 */
final readonly class DriverSwitchStartFailed extends SessionEvent implements DriverSwitchEvent
{
    public function __construct(public string $switchId, public string $reason) {}
}
