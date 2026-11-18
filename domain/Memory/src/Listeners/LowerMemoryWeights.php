<?php

declare(strict_types=1);

namespace Domain\Memory\Listeners;

use App\Hooks\Events\ContextWasCompacted;
use Domain\Memory\Support\AgentMemories;

/**
 * Fades the agent's memories once for this compaction, then reminds it of the ones that remain.
 */
final readonly class LowerMemoryWeights
{
    public function __construct(private AgentMemories $memories) {}

    public function handle(ContextWasCompacted $event): void
    {
        $this->memories->lowerWeightsOnce($event->target, $event->compactionId);

        foreach ($this->memories->remindersFor($event->target->agentId) as $reminder) {
            $event->reminders->add($reminder);
        }
    }
}
