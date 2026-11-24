<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Drivers\DriverSwitchEvent;

/**
 * A driver switch was refused, for the reason given.
 */
final readonly class DriverSwitchRefused extends SessionEvent implements DriverSwitchEvent
{
    public function __construct(public string $switchId, public string $reason) {}
}
