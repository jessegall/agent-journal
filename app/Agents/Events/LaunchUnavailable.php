<?php

declare(strict_types=1);

namespace App\Agents\Events;

use App\Agents\Enums\LaunchUnavailableReason;
use App\Contracts\Event;
use App\Ui\Contracts\UpdatesUserInterface;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A launch of an agent was refused because no account could run its program; it names the program and a safe
 * reason, never an account.
 */
final readonly class LaunchUnavailable implements Event, ShouldDispatchAfterCommit, UpdatesUserInterface
{
    public function __construct(
        public string $agentId,
        public string $program,
        public LaunchUnavailableReason $reason,
    ) {}
}
