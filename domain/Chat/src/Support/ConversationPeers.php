<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use Domain\Chat\Models\Conversation;

/**
 * The actor's own inbox and the peer's, once the actor was found to take part in their conversation.
 */
final readonly class ConversationPeers
{
    public function __construct(public string $ownInboxId, public string $peerInboxId) {}

    /**
     * Their conversation row, made the first time and locked.
     */
    public function conversation(): Conversation
    {
        return Conversation::between($this->ownInboxId, $this->peerInboxId);
    }

    /**
     * Their conversation row, once one was made.
     */
    public function existingConversation(): Conversation|null
    {
        return Conversation::existingBetween($this->ownInboxId, $this->peerInboxId);
    }
}
