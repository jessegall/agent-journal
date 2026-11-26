<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\DriverSwitchEvent;

/**
 * A driver switch passed its checks before the stop.
 */
final readonly class DriverSwitchPreflighted implements DriverSwitchEvent, SessionEvent
{
    public function __construct(public string $switchId) {}
}
