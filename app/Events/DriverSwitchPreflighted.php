<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Drivers\DriverSwitchEvent;

/**
 * A driver switch passed its checks before the stop.
 */
final readonly class DriverSwitchPreflighted extends SessionEvent implements DriverSwitchEvent
{
    public function __construct(public string $switchId) {}
}
