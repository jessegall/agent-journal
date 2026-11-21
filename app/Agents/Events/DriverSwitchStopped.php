<?php

declare(strict_types=1);

namespace App\Agents\Events;

use App\Contracts\Event;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * The session a switch replaces is proven stopped, so its replacement may start. Raised after the commit.
 */
final readonly class DriverSwitchStopped implements Event, ShouldDispatchAfterCommit
{
    public function __construct(public string $switchId) {}
}
