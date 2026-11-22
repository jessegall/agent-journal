<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Event;
use App\Contracts\InboxScopedFact;
use App\Contracts\UserInterfaceUpdater;
use App\Enums\LeaveReason;
use App\Support\ActorIdentity;

/**
 * An actor's interval in a chat inbox ended, for the reason given.
 */
final readonly class ChatMemberLeft implements Event, InboxScopedFact, UserInterfaceUpdater
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
