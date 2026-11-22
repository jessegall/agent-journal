<?php

declare(strict_types=1);

namespace App\Communication\Events;

use App\Actors\Support\ActorIdentity;
use App\Communication\Contracts\InboxScopedFact;
use App\Communication\Enums\LeaveReason;
use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * An actor's interval in a chat inbox ended, for the reason given.
 */
final readonly class ChatMemberLeft implements Event, InboxScopedFact, ShouldDispatchAfterCommit, UserInterfaceUpdater
{
    public function __construct(
        public string $intervalId,
        public string $inboxId,
        public ActorIdentity $member,
        public LeaveReason $reason,
    ) {}

    public function scopedInboxId(): string
    {
        return $this->inboxId;
    }
}
