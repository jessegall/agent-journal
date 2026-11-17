<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Listeners;

use App\Domain\Agents\Events\LaunchLost;
use App\Domain\Hooks\LaunchStacks;
use App\Domain\Hooks\Storage\StackTarget;

/**
 * Closes a lost launch's stack and keeps it, frames and all, so its obligations stay visible; no subject is finished.
 */
final readonly class CloseLostLaunchStack
{
    public function __construct(private LaunchStacks $stacks) {}

    public function handle(LaunchLost $event): void
    {
        $this->stacks->close(new StackTarget($event->agentId, $event->sessionId));
    }
}
