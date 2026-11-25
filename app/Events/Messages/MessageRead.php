<?php

declare(strict_types=1);

namespace App\Events\Messages;

use App\Support\ActorReference;

/**
 * An actor read a message for the first time.
 */
final readonly class MessageRead implements MessageEvent
{
    public function __construct(
        public string $messageId,
        public string $inboxId,
        public ActorReference $reader,
    ) {}
}
