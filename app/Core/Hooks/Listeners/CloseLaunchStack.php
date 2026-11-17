<?php

declare(strict_types=1);

namespace App\Core\Hooks\Listeners;

use App\Core\Agents\Events\LaunchEnded;
use App\Core\Agents\Events\LaunchLost;
use App\Core\Agents\Support\StackTarget;
use App\Core\Hooks\Actions\LaunchStacks;

/**
 * Closes a launch's stack when the launch ends or is lost. The closed stack is kept, frames and all, so a lost
 * launch's obligations stay visible; no subject is finished.
 */
final readonly class CloseLaunchStack
{
    public function __construct(private LaunchStacks $stacks) {}

    public function handle(LaunchEnded|LaunchLost $event): void
    {
        $this->stacks->close(new StackTarget($event->agentId, $event->sessionId));
    }
}
