<?php

declare(strict_types=1);

namespace App\Hooks\Listeners;

use App\Agents\Events\SessionClosed;
use App\Agents\Values\StackTarget;
use App\Contracts\Attributes\InCommandTransaction;
use App\Contracts\Listener;
use App\Hooks\Actions\StartStacks;

/**
 * Closes a start's stack when the start ends. The closed stack is kept, frames and all, so the ended start's
 * obligations stay visible; no subject is finished.
 */
#[InCommandTransaction]
final readonly class CloseStartStack implements Listener
{
    public function __construct(private StartStacks $stacks) {}

    public function handle(SessionClosed $event): void
    {
        $this->stacks->close(new StackTarget($event->agentId, $event->sessionId));
    }
}
