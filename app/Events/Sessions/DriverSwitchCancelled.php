<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\DriverSwitchEvent;

/**
 * A driver switch was called off, for the reason given when there is one.
 */
final readonly class DriverSwitchCancelled extends SessionEvent implements DriverSwitchEvent
{
    public function __construct(public string $switchId, public string|null $reason) {}
}
