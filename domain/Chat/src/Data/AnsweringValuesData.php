<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Data;

/**
 * What an answering state keeps with its frame: the messages that wait for the agent's answer, oldest first, the tool
 * uses it made since the first of them came, and whether it has answered.
 */
final class AnsweringValuesData extends Data
{
    /**
     * @param  list<string>  $waitingIds
     */
    public function __construct(
        public readonly array $waitingIds = [],
        public readonly int $toolUses = 0,
        public readonly bool $isAnswered = false,
    ) {}

    public function withMessage(string $messageId): self
    {
        return clone ($this, [
            'waitingIds' => array_values(array_unique([...$this->waitingIds, $messageId])),
            'isAnswered' => false,
        ]);
    }

    public function withToolUse(): self
    {
        return clone ($this, ['toolUses' => $this->toolUses + 1]);
    }

    /**
     * The values after the agent answered in the chat: nothing waits any more.
     */
    public function answered(): self
    {
        return new self(isAnswered: true);
    }
}
