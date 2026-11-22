<?php

declare(strict_types=1);

namespace App\Communication\Events;

use App\Actors\Support\ActorIdentity;
use App\Communication\Contracts\InboxScopedFact;
use App\Communication\Enums\IntervalRole;
use App\Contracts\Event;
use App\Ui\Contracts\UserInterfaceUpdater;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A member of a chat took a new role, as the owner role passes on a transfer.
 */
final readonly class ChatRoleChanged implements Event, InboxScopedFact, ShouldDispatchAfterCommit, UserInterfaceUpdater
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
