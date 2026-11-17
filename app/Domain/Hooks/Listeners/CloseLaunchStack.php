<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Listeners;

use App\Domain\Agents\Events\LaunchEnded;
use App\Domain\Hooks\LaunchStacks;
use App\Domain\Hooks\Storage\StackTarget;

final readonly class CloseLaunchStack
{
    public function __construct(private LaunchStacks $stacks) {}

    public function handle(LaunchEnded $event): void
    {
        $this->stacks->close(new StackTarget($event->agentId, $event->sessionId));
    }
}
