<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Actors\Support\ActorIdentity;
use Domain\Chat\Exceptions\ConversationUnavailable;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Models\DirectChat;

/**
 * The actor and the peer it talks with, each with its own desk inbox, once the actor was found to take part: their
 * direct chat is found by the two actors, never by the two inboxes.
 */
final readonly class ConversationPeers
{
    public function __construct(
        public string $ownInboxId,
        public string $peerInboxId,
        public ActorIdentity $own,
        public ActorIdentity $peer,
    ) {}

    /**
     * Their direct chat, which must already be open.
     *
     * @throws ConversationUnavailable
     */
    public function conversation(): Conversation
    {
        $conversation = $this->existingConversation();

        if ($conversation === null) {
            throw ConversationUnavailable::none();
        }

        return $conversation;
    }

    /**
     * Their direct chat, once one was opened.
     */
    public function existingConversation(): Conversation|null
    {
        return DirectChat::findPair(null, $this->own, $this->peer)?->conversation;
    }
}
