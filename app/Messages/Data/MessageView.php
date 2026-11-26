<?php

declare(strict_types=1);

namespace App\Messages\Data;

use App\Messages\ShownMessage;
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

    public static function of(ShownMessage $message): self
    {
        return new self(
            $message->id,
            $message->inboxId,
            $message->senderType,
            $message->senderId,
            $message->body,
            $message->number,
            $message->targetMessageId,
            $message->sentAt,
        );
    }
}
