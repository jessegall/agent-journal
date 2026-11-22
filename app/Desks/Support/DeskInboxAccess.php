<?php

declare(strict_types=1);

namespace App\Desks\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Models\AssignmentRecord;
use App\Assignments\Support\AssigneeIdentity;
use App\Communication\Contracts\Inbox;
use App\Communication\Contracts\InboxAccess;
use App\Communication\Exceptions\InboxUnavailable;
use App\Communication\Support\InboxMembers;
use App\Communication\Support\InboxMembership;
use App\Desks\Models\DeskRecord;
use App\Desks\Models\DeskSeat;
use Illuminate\Database\Eloquent\Builder;

/**
 * Who may use a desk's inbox: the actors seated at the desk, each proven by the exact assignment of its seat. The desk
 * row is the lock that keeps seating still while a message is sent or read.
 */
final readonly class DeskInboxAccess implements InboxAccess
{
    public function lockShared(Inbox $inbox): void
    {
        DeskRecord::query()->where('inbox_id', $inbox->inboxId())->sharedLock()->firstOr(
            fn () => throw InboxUnavailable::forId($inbox->inboxId()),
        );
    }

    public function lockExclusive(Inbox $inbox): void
    {
        DeskRecord::query()->where('inbox_id', $inbox->inboxId())->lockForUpdate()->firstOr(
            fn () => throw InboxUnavailable::forId($inbox->inboxId()),
        );
    }

    /**
     * @throws InboxUnavailable
     */
    public function membership(Inbox $inbox, Actor $actor): InboxMembership
    {
        $seat = $this->seatAssignments($inbox)
            ->heldBy(AssigneeIdentity::of($actor))
            ->firstOr(fn () => throw InboxUnavailable::forId($inbox->inboxId()));

        return $this->membershipOf($seat);
    }

    public function members(Inbox $inbox): InboxMembers
    {
        $seats = $this->seatAssignments($inbox)->limit(InboxMembers::LIMIT)->orderBy('id')->get();

        $memberships = $seats->map(fn (AssignmentRecord $seat) => $this->membershipOf($seat))->all();

        return new InboxMembers(array_values($memberships));
    }

    /**
     * @return Builder<AssignmentRecord>
     */
    private function seatAssignments(Inbox $inbox): Builder
    {
        $seatIds = DeskSeat::query()
            ->select('id')
            ->whereIn('desk_id', DeskRecord::query()->select('id')->where('inbox_id', $inbox->inboxId()));

        return AssignmentRecord::query()->assignedAmong(DeskSeat::LINK_TYPE, $seatIds);
    }

    private function membershipOf(AssignmentRecord $seat): InboxMembership
    {
        $assignment = $seat->toAssignment();

        return InboxMembership::atDeskSeat(SeatOccupant::of($assignment), $assignment->reference);
    }

    public function memberInboxIds(ActorIdentity $actor): Builder
    {
        return DeskRecord::query()->occupiedBy($actor)->select('inbox_id');
    }
}
