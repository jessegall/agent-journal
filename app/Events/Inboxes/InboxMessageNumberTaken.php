<?php

declare(strict_types=1);

namespace App\Events\Inboxes;

/**
 * An inbox gave out the number of its next message.
 */
final readonly class InboxMessageNumberTaken implements InboxEvent
{
    public function __construct(
        public string $inboxId,
    ) {}
}
