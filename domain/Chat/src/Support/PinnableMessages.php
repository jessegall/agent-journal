<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Communication\Contracts\ConversationResolver;
use App\Communication\Data\MessageView;
use App\Communication\Exceptions\MessageMissing;

/**
 * Which messages the asker may pin: one it can read now, between exactly the two inboxes the conversation names.
 */
final readonly class PinnableMessages
{
    public function __construct(private ConversationResolver $messages) {}

    /**
     * @throws MessageMissing
     */
    public function requireIn(ConversationPair $pair, string $messageId): MessageView
    {
        $message = $this->messages->detail($messageId);

        if (! $pair->holds($message->sourceInboxId, $message->destinationInboxId)) {
            throw MessageMissing::forId($messageId);
        }

        return $message;
    }
}
