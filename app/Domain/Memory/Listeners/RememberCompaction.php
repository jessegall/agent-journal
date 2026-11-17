<?php

declare(strict_types=1);

namespace App\Domain\Memory\Listeners;

use App\Domain\Hooks\Events\ContextWasCompacted;
use App\Domain\Memory\AgentMemories;

/**
 * Fades the agent's memories once for this compaction, then reminds it of the ones that remain.
 */
final readonly class RememberCompaction
{
    public function __construct(private AgentMemories $memories) {}

    public function handle(ContextWasCompacted $event): void
    {
        $this->memories->fadeOnce($event->agentId, $event->sessionId, $event->compactionId);

        foreach ($this->memories->remindersFor($event->agentId) as $reminder) {
            $event->reminders->add($reminder);
        }
    }
}
