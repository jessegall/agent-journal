<?php

declare(strict_types=1);

namespace App\Events\Messages;

/**
 * A message was sent into an inbox, as a reply to its target message when it has one.
 */
final readonly class MessageSent extends MessageEvent
{
    public function __construct(
        public string $messageId,
        public string $inboxId,
        public string|null $targetMessageId,
    ) {}
}
