<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Event;
use App\Contracts\InboxScopedFact;
use App\Contracts\UserInterfaceUpdater;
use App\Support\ActorIdentity;

/**
 * An actor began an interval in a chat inbox and takes part in it from that timeline position.
 */
final readonly class ChatMemberJoined implements Event, InboxScopedFact, UserInterfaceUpdater
{
    public function __construct(
        public string $intervalId,
        public string $inboxId,
        public ActorIdentity $member,
    ) {}

    public function scopedInboxId(): string
    {
        return $this->inboxId;
    }
}
