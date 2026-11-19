<?php

declare(strict_types=1);

namespace App\Hooks\Listeners;

use App\Agents\Events\SessionOpened;
use App\Agents\Support\StackTarget;
use App\Contracts\Listener;
use App\Hooks\Actions\StartStacks;

/**
 * Opens the started agent's stack with the one ready bottom state, in the start transaction. A start with no
 * parser to read its shell commands is refused before the program starts.
 */
final readonly class OpenStartStack implements Listener
{
    public function __construct(private StartStacks $stacks) {}

    public function handle(SessionOpened $event): void
    {
        $this->stacks->open(new StackTarget($event->agentId, $event->sessionId));
    }
}
