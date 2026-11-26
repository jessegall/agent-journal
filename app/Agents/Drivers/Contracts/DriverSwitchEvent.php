<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Contracts;

use App\Contracts\Events\Event;

/**
 * A step of a switch of an agent to another driver, from its checks to its end.
 */
interface DriverSwitchEvent extends Event
{
    public string $switchId { get; }
}
