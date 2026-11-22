<?php

declare(strict_types=1);

namespace App\Communication\Events;

use App\Actors\Support\ActorIdentity;
use App\Communication\Contracts\InboxScopedFact;
use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * An actor began an interval in a chat inbox and takes part in it from that timeline position.
 */
final readonly class ChatMemberJoined implements Event, InboxScopedFact, ShouldDispatchAfterCommit, UserInterfaceUpdater
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
