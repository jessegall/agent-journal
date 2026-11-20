<?php

declare(strict_types=1);

namespace App\Agents\Events;

use App\Agents\Enums\StartUnavailableReason;
use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A start of an agent was refused because no account could run its program; it names the program and a safe
 * reason, never an account.
 */
final readonly class StartUnavailable implements Event, ShouldDispatchAfterCommit, UserInterfaceUpdater
{
    public function __construct(
        public string $agentId,
        public string $program,
        public StartUnavailableReason $reason,
    ) {}
}
