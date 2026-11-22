<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Events\SessionOpened;
use App\Support\StartStacks;
use App\Values\StackTarget;

/**
 * Opens the started agent's stack with the one ready bottom state, in the start transaction. A start with no
 * parser to read its shell commands is refused before the driver starts.
 */
#[InCommandTransaction]
final readonly class OpenStartStack implements Listener
{
    public function __construct(private StartStacks $stacks) {}

    public function handle(SessionOpened $event): void
    {
        $this->stacks->open(new StackTarget($event->agentId, $event->sessionId));
    }
}
