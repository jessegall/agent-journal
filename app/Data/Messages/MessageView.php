<?php

declare(strict_types=1);

namespace App\Data\Messages;

use App\Models\Messages\Message;
use Spatie\LaravelData\Data;

/**
 * One message as a reader sees it: who sent it, its text, the message it replies to and when it was sent.
 */
final class MessageView extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $inboxId,
        public readonly string $senderType,
        public readonly string $senderId,
        public readonly string $body,
        public readonly int $number,
        public readonly string|null $targetMessageId,
        public readonly string $sentAt,
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
            $message->created_at?->toIso8601String() ?? '',
        );
    }
}
