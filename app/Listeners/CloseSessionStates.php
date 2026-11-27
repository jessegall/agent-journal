<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Events\Sessions\SessionClosed;
use App\Sessions\States\SessionStateLifecycle;
use App\Values\StackTarget;

/**
 * Closes a session's stack when the session ends. The closed stack is kept, frames and all, so the ended session's
 * obligations stay visible; no subject is finished.
 */
#[InCommandTransaction]
final readonly class CloseSessionStates implements Listener
{
    public function __construct(private SessionStateLifecycle $stacks) {}

    public function handle(SessionClosed $event): void
    {
        $this->stacks->close(new StackTarget($event->agentId, $event->sessionId));
    }
}
