<?php

declare(strict_types=1);

namespace Domain\Memory\Support;

use App\Support\ActorReference;
use App\Values\AgentText;
use Domain\Memory\Models\Memory;

/**
 * The named reads of an agent's memories: the reminders they give, heaviest first.
 */
final readonly class AgentMemories
{
    /**
     * @return list<AgentText>
     */
    public function remindersFor(ActorReference $actor): array
    {
        $texts = Memory::query()
            ->ownedBy($actor)
            ->byWeightDescendingThenId()
            ->pluck('text')
            ->all();

        return array_values(array_map(
            fn (string $text) => AgentText::of('memory.reminder', ['text' => $text]),
            $texts,
        ));
    }
}
