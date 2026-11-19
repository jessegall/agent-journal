<?php

declare(strict_types=1);

namespace Domain\Memory\Support;

use App\Actors\Support\ActorIdentity;
use Domain\Memory\Models\Memory;

/**
 * The named reads of an agent's memories: the reminders they give, heaviest first.
 */
final readonly class AgentMemories
{
    /**
     * @return list<string>
     */
    public function remindersFor(ActorIdentity $actor): array
    {
        $texts = Memory::query()->ownedBy($actor)->orderByDesc('weight')->orderBy('id')->readAll('every memory of the agent is a reminder')->pluck('text')->all();

        return array_values(array_map(fn (string $text) => "Memory: {$text}", $texts));
    }
}
