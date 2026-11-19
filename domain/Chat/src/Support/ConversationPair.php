<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

/**
 * The two inboxes a conversation is between, as Chat shows it: the asker's side first.
 */
final readonly class ConversationPair
{
    public function __construct(
        public string $sourceInboxId,
        public string $destinationInboxId,
    ) {}

    /**
     * Whether a message between these two inboxes, either way, belongs to this conversation.
     */
    public function holds(string $firstInboxId, string $secondInboxId): bool
    {
        return [$firstInboxId, $secondInboxId] === [$this->sourceInboxId, $this->destinationInboxId]
            || [$secondInboxId, $firstInboxId] === [$this->sourceInboxId, $this->destinationInboxId];
    }
}
