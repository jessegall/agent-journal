<?php

declare(strict_types=1);

namespace App\Communication\Data;

use App\Communication\Enums\MessageState;

/**
 * A message as a reader sees it: who wrote it, between which inboxes, its text, its state and when it was first read.
 */
final readonly class MessageView
{
    public function __construct(
        public string $id,
        public string $sourceInboxId,
        public string $destinationInboxId,
        public string $senderType,
        public string $senderId,
        public string $body,
        public MessageState $state,
        public int $stateVersion,
        public string|null $replyToId,
        public string|null $readAt,
        public string $sentAt,
    ) {}
}
