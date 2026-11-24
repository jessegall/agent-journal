<?php

declare(strict_types=1);

namespace Tests\Fixtures\Communication;

use App\Contracts\Actors\Actor;
use App\Support\ActorIdentity;
use App\Contracts\Inboxes\LabeledInbox;
use App\Contracts\Chat\InboxAccess;
use App\Exceptions\InboxUnavailable;
use App\Models\Inboxes\Inbox;
use App\Support\InboxMembers;
use App\Support\InboxMembership;
use Illuminate\Database\Eloquent\Builder;

/**
 * A team inbox's guards and members: the inbox's own row is its guard, shared by sends and held alone by a
 * membership change, and the team roster says who sits on it.
 */
final readonly class TeamInboxAccess implements InboxAccess
{
    public function __construct(private TeamRoster $roster) {}

    public function lockShared(LabeledInbox $inbox): void
    {
        Inbox::query()->whereKey($inbox->inboxId())->sharedLock()->firstOr(fn () => throw InboxUnavailable::forId($inbox->inboxId()));
    }

    public function lockExclusive(LabeledInbox $inbox): void
    {
        Inbox::query()->whereKey($inbox->inboxId())->lockForUpdate()->firstOr(fn () => throw InboxUnavailable::forId($inbox->inboxId()));
    }

    public function membership(LabeledInbox $inbox, Actor $actor): InboxMembership
    {
        return array_find(
            $this->roster->membersOf($inbox->inboxId()),
            fn (InboxMembership $member) => $member->actor->isSameAs(ActorIdentity::of($actor)),
        ) ?? throw InboxUnavailable::forId($inbox->inboxId());
    }

    public function members(LabeledInbox $inbox): InboxMembers
    {
        return new InboxMembers($this->roster->membersOf($inbox->inboxId()));
    }

    public function memberInboxIds(ActorIdentity $actor): Builder
    {
        return Inbox::query()->whereKey($this->roster->inboxIdsOf($actor))->select('id as inbox_id');
    }
}
