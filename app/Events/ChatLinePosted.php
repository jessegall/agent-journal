<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Events\Event;
use App\Contracts\Events\InboxScopedFact;
use App\Contracts\Navigation\UserInterfaceUpdater;

/**
 * A plain line was posted into a chat inbox's timeline at its position, so the chat shows it between the messages.
 */
final readonly class ChatLinePosted implements Event, InboxScopedFact, UserInterfaceUpdater
{
    public function __construct(
        public string $timelineEventId,
        public string $inboxId,
        public int $sequence,
    ) {}

    public function scopedInboxId(): string
    {
        return $this->inboxId;
    }
}
