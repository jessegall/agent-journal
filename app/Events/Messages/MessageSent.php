<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Support\ActorIdentity;

/**
 * A message was sent into an inbox, as a reply to its target message when it has one.
 */
final readonly class MessageSent extends MessageEvent
{
    public function __construct(
        public string $messageId,
        public string $inboxId,
        public int $number,
        public string|null $targetMessageId,
        public ActorIdentity $sender,
    ) {}
}
