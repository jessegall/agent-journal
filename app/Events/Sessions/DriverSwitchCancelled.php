<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\DriverSwitchEvent;

/**
 * A driver switch was called off, for the reason given when there is one.
 */
final readonly class DriverSwitchCancelled implements DriverSwitchEvent, SessionEvent
{
    public function __construct(public string $switchId, public string|null $reason) {}
}
