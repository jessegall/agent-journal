<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Drivers\DriverSwitchEvent;

/**
 * A driver switch's replacing session runs, so the switch is done.
 */
final readonly class DriverSwitchConfirmed extends SessionEvent implements DriverSwitchEvent
{
    public function __construct(public string $switchId) {}
}
