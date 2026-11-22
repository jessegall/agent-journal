<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Events\Event;
use App\Contracts\Events\InboxScopedFact;
use App\Contracts\Navigation\UserInterfaceUpdater;
use App\Support\ActorIdentity;

/**
 * A chat message took its place in its chat inbox's timeline; raised once its acceptance has committed.
 */
final readonly class ChatMessageAccepted implements
    Event,
    InboxScopedFact,
    UserInterfaceUpdater
{
    public function __construct(
        public string $messageId,
        public ActorIdentity $author,
        public string $inboxId,
    ) {}

    public function scopedInboxId(): string
    {
        return $this->inboxId;
    }
}
