<?php

declare(strict_types=1);

namespace App\Messages;

use App\Models\Messages\Message;

/**
 * One message as a reader is shown it: who sent it, its text, the message it replies to and when it was sent.
 */
final readonly class ShownMessage
{
    public function __construct(
        public string $id,
        public string $inboxId,
        public string $senderType,
        public string $senderId,
        public string $body,
        public int $number,
        public string|null $targetMessageId,
        public string $sentAt,
    ) {}

    public static function of(Message $message): self
    {
        return new self(
            $message->id,
            $message->inbox_id,
            $message->sender_type,
            $message->sender_id,
            $message->body,
            $message->number,
            $message->target_message_id,
            $message->created_at->toIso8601String(),
        );
    }
}
