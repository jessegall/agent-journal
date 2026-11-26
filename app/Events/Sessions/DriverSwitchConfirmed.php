<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\DriverSwitchEvent;

/**
 * A driver switch's replacing session runs, so the switch is done.
 */
final readonly class DriverSwitchConfirmed implements DriverSwitchEvent, SessionEvent
{
    public function __construct(public string $switchId) {}
}
