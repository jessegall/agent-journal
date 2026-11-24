<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Chat\ChatMembershipEvent;
use App\Contracts\Events\InboxScopedFact;
use App\Contracts\Navigation\UserInterfaceUpdater;
use App\Enums\IntervalRole;
use App\Support\ActorIdentity;

/**
 * A member of a chat took a new role, as the owner role passes on a transfer.
 */
final readonly class ChatRoleChanged extends MessageEvent implements
    ChatMembershipEvent,
    InboxScopedFact,
    UserInterfaceUpdater
{
    public function __construct(
        public string $intervalId,
        public string $inboxId,
        public ActorIdentity $member,
        public IntervalRole $role,
    ) {}

    public function scopedInboxId(): string
    {
        return $this->inboxId;
    }
}
