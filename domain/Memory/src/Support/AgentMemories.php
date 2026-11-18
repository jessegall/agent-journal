<?php

declare(strict_types=1);

namespace Domain\Memory\Support;

use App\Actors\Support\ActorIdentity;
use App\Agents\Support\StackTarget;
use Domain\Memory\Models\Memory;
use Domain\Memory\Models\MemoryCompaction;

/**
 * The named operations on an agent's memories: fading them once per compaction, and the reminders they give.
 */
final readonly class AgentMemories
{
    /**
     * Lowers every memory of the agent by one for this compaction, once: a repeated compaction id changes nothing.
     */
    public function lowerWeightsOnce(StackTarget $target, string $compactionId): void
    {
        if (! MemoryCompaction::recordOnce($target->actorIdentity(), $compactionId)) {
            return;
        }

        Memory::query()->ownedBy($target->actorIdentity())->decrement('weight');
        Memory::query()->ownedBy($target->actorIdentity())->where('weight', '<=', 0)->delete();
    }

    /**
     * @return list<string>
     */
    public function remindersFor(ActorIdentity $actor): array
    {
        $texts = Memory::query()->ownedBy($actor)->orderByDesc('weight')->orderBy('id')->readAll('every memory of the agent is a reminder')->pluck('text')->all();

        return array_values(array_map(fn (string $text) => "Memory: {$text}", $texts));
    }
}
