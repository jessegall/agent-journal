<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Event;
use App\Contracts\ListenerFailureLog;
use App\Contracts\UserInterfaceUpdater;
use App\Enums\StartUnavailableReason;

/**
 * A start of an agent was refused because no account could run its driver; it names the driver and a safe
 * reason, never an account.
 */
final readonly class StartUnavailable implements Event, ListenerFailureLog, UserInterfaceUpdater
{
    public function __construct(
        public string $agentId,
        public string $driver,
        public StartUnavailableReason $reason,
    ) {}
}
