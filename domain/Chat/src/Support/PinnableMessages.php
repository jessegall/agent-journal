<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Contracts\Chat\ConversationResolver;
use App\Data\MessageView;
use App\Exceptions\MessageMissing;

/**
 * Which messages the asker may pin: one it can see now, posted in the chat it pins it in.
 */
final readonly class PinnableMessages
{
    public function __construct(private ConversationResolver $messages) {}

    /**
     * @throws MessageMissing
     */
    public function requireIn(string $inboxId, string $messageId): MessageView
    {
        $message = $this->messages->detail($messageId);

        if ($message->destinationInboxId !== $inboxId) {
            throw MessageMissing::forId($messageId);
        }

        return $message;
    }
}
