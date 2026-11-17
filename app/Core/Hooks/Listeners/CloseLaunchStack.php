<?php

declare(strict_types=1);

namespace App\Core\Hooks\Listeners;

use App\Core\Agents\Events\LaunchEnded;
use App\Core\Agents\Events\LaunchTimedOut;
use App\Core\Agents\Support\StackTarget;
use App\Core\Hooks\Actions\LaunchStacks;

/**
 * Closes a launch's stack when the launch ends or times out. The closed stack is kept, frames and all, so a timed-out
 * launch's obligations stay visible; no subject is finished.
 */
final readonly class CloseLaunchStack
{
    public function __construct(private LaunchStacks $stacks) {}

    public function handle(LaunchEnded|LaunchTimedOut $event): void
    {
        $this->stacks->close(new StackTarget($event->agentId, $event->sessionId));
    }
}
