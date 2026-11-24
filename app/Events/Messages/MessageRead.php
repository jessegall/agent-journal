<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Support\ActorIdentity;

/**
 * An actor read a message for the first time.
 */
final readonly class MessageRead extends MessageEvent
{
    public function __construct(
        public string $messageId,
        public string $inboxId,
        public ActorIdentity $reader,
    ) {}
}
