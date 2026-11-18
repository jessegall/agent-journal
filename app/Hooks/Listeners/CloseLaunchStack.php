<?php

declare(strict_types=1);

namespace App\Hooks\Listeners;

use App\Agents\Events\LaunchEnded;
use App\Agents\Support\StackTarget;
use App\Contracts\Listener;
use App\Hooks\Actions\LaunchStacks;

/**
 * Closes a launch's stack when the launch ends. The closed stack is kept, frames and all, so the ended launch's
 * obligations stay visible; no subject is finished.
 */
final readonly class CloseLaunchStack implements Listener
{
    public function __construct(private LaunchStacks $stacks) {}

    public function handle(LaunchEnded $event): void
    {
        $this->stacks->close(new StackTarget($event->agentId, $event->sessionId));
    }
}
