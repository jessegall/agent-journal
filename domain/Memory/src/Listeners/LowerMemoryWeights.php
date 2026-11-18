<?php

declare(strict_types=1);

namespace Domain\Memory\Listeners;

use App\Contracts\Listener;
use App\Hooks\Enums\ContextStartType;
use App\Hooks\Events\ContextStarted;
use Domain\Memory\Support\AgentMemories;

/**
 * Fades the agent's memories once for a compaction, then reminds it of the ones that remain whenever its context
 * starts again.
 */
final readonly class LowerMemoryWeights implements Listener
{
    public function __construct(private AgentMemories $memories) {}

    public function handle(ContextStarted $event): void
    {
        if ($event->type === ContextStartType::Compact) {
            $this->memories->lowerWeightsOnce($event->target, $event->hookId);
        }

        foreach ($this->memories->remindersFor($event->target->actorIdentity()) as $reminder) {
            $event->reminders->add($reminder, false);
        }
    }
}
