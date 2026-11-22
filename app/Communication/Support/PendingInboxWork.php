<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\PendingWorkSource;
use App\Communication\Models\Message;

/**
 * Counts the messages waiting for an actor across the inboxes it belongs to now: desk mail unread or waiting for an
 * answer, and chat rows not yet shown to it or questions kept for its turn, each counted once. A hook announces the count; it never reads, claims or installs a frame.
 */
final readonly class PendingInboxWork implements PendingWorkSource
{
    public function __construct(private RegisteredInboxes $inboxes) {}

    public function pendingCount(ActorIdentity $actor): int
    {
        return Message::query()
            ->acrossInboxes()
            ->whereIn('destination_inbox_id', $this->inboxes->inboxIdsOf($actor))
            ->pendingFor($actor)
            ->distinct()
            ->count('id');
    }
}
