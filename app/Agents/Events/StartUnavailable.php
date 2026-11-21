<?php

declare(strict_types=1);

namespace App\Agents\Events;

use App\Agents\Enums\StartUnavailableReason;
use App\Contracts\Event;
use App\Contracts\ListenerFailureLog;
use App\Ui\Contracts\UserInterfaceUpdater;

/**
 * A start of an agent was refused because no account could run its program; it names the program and a safe
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
