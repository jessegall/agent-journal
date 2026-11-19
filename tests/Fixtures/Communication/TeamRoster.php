<?php

declare(strict_types=1);

namespace Tests\Fixtures\Communication;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\AssignmentReference;
use App\Communication\Support\InboxMembership;
use Illuminate\Support\Str;

/**
 * Who sits on each team inbox in a test: each member keeps the reference it joined under, so a member who leaves and
 * joins again is a new membership.
 */
final class TeamRoster
{
    /**
     * @var array<string, list<InboxMembership>>
     */
    private array $members = [];

    public function join(string $inboxId, ActorIdentity $actor): void
    {
        $reference = new AssignmentReference((string) Str::ulid(), AssigneeIdentity::ofActorIdentity($actor));
        $this->members[$inboxId][] = new InboxMembership($actor, $reference);
    }

    /**
     * @return list<InboxMembership>
     */
    public function membersOf(string $inboxId): array
    {
        return $this->members[$inboxId] ?? [];
    }

    /**
     * @return list<string>
     */
    public function inboxIdsOf(ActorIdentity $actor): array
    {
        return array_keys(array_filter(
            $this->members,
            fn (array $members) => array_any($members, fn (InboxMembership $member) => $member->actor->isSameAs($actor)),
        ));
    }
}
