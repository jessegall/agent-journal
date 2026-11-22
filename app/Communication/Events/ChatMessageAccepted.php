<?php

declare(strict_types=1);

namespace App\Communication\Events;

use App\Actors\Support\ActorIdentity;
use App\Communication\Contracts\InboxScopedFact;
use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;

/**
 * A chat message took its place in its chat inbox's timeline; raised once its acceptance has committed.
 */
final readonly class ChatMessageAccepted implements Event, InboxScopedFact, UserInterfaceUpdater
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
