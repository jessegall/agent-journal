<?php

declare(strict_types=1);

namespace Domain\Memory\Listeners;

use App\Contracts\Events\Listener;
use App\Events\Hooks\ContextStarted;
use Domain\Memory\Support\AgentMemories;

/**
 * Gives an agent its memories, heaviest first, whenever its context starts again: a start, clear, resume or
 * compaction on any driver. It only reads; the budget may leave light ones out and says how many.
 */
final readonly class SupplyMemories implements Listener
{
    public function __construct(private AgentMemories $memories) {}

    public function handle(ContextStarted $event): void
    {
        foreach ($this->memories->remindersFor($event->target->actorIdentity()) as $reminder) {
            $event->reminders->add($reminder, false);
        }
    }
}
