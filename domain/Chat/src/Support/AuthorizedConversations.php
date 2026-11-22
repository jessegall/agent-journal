<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Chat\InboxResolver;
use App\Exceptions\InboxUnavailable;
use Domain\Chat\Exceptions\ConversationUnavailable;
use Domain\Chat\Models\Conversation;

/**
 * The chat the current actor names by its inbox, when it holds an active interval in it. An inbox id alone never
 * authorizes, and a chat the actor takes no part in is refused the same way as one that does not exist.
 */
final readonly class AuthorizedConversations
{
    public function __construct(
        private CurrentActor $actors,
        private InboxResolver $inboxes,
    ) {}

    /**
     * @throws ConversationUnavailable
     */
    public function inInbox(string $inboxId): Conversation
    {
        try {
            $inbox = $this->inboxes->resolve($inboxId);
            $this->inboxes->accessFor($inbox)->membership($inbox, $this->actors->actor());
        } catch (InboxUnavailable $refused) {
            throw ConversationUnavailable::withPeer($refused);
        }

        return Conversation::forInbox($inboxId);
    }
}
