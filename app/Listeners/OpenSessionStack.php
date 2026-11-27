<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Attributes\Listeners\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Events\Sessions\SessionOpened;
use App\Stacks\SessionStateLifecycle;
use App\Values\StackTarget;

/**
 * Opens the session's stack on its base, the ready state and the profile state, in the start transaction. A start
 * with no parser to read its shell commands is refused before the driver starts.
 */
#[InCommandTransaction]
final readonly class OpenSessionStack implements Listener
{
    public function __construct(private SessionStateLifecycle $stacks) {}

    public function handle(SessionOpened $event): void
    {
        $this->stacks->open(new StackTarget($event->agentId, $event->sessionId));
    }
}
