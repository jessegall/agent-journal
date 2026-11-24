<?php

declare(strict_types=1);

namespace App\Events;

/**
 * An inbox handed out its next message sequence number.
 */
final readonly class InboxSequenceTaken extends MessageEvent
{
    public function __construct(
        public string $inboxId,
    ) {}
}
