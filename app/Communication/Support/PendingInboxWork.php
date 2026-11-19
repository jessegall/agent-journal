<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\PendingWorkSource;
use App\Communication\Contracts\MemberInboxes;
use App\Communication\Enums\MessageState;
use App\Communication\Models\Message;
use Illuminate\Database\Eloquent\Builder;

/**
 * Counts the messages waiting for an actor across the inboxes it belongs to now: unread ones and ones waiting for an
 * answer, each counted once. A hook announces the count; it never reads, claims or installs a frame.
 */
final readonly class PendingInboxWork implements PendingWorkSource
{
    public function __construct(private MemberInboxes $inboxes) {}

    public function pendingCount(ActorIdentity $actor): int
    {
        return Message::query()
            ->withoutGlobalScopes()
            ->whereIn('destination_inbox_id', $this->inboxes->inboxIdsOf($actor))
            ->where(fn (Builder $pending) => $pending
                ->whereNull('read_at')
                ->orWhere('state', MessageState::WaitingForAnswer))
            ->distinct()
            ->count('id');
    }
}
