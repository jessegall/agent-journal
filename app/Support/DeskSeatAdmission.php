<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Assignments\AssigneeLocks;
use App\Contracts\Assignments\AssignmentStorage;
use App\Exceptions\SeatCapacityReached;
use App\Exceptions\SeatConflict;
use App\Exceptions\SecondForwardingSeat;
use App\Models\Desks\DeskRecord;
use App\Models\Desks\DeskSeat;
use App\Models\Records\AssignmentRecord;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Admits seat changes in one lock order: the involved actors exclusively, sorted, then the desk, then the seat's
 * current assignment. Nothing is written here.
 */
final readonly class DeskSeatAdmission
{
    public function __construct(
        private AssigneeLocks $locks,
        private AssignmentStorage $store,
    ) {}

    public function seat(string $deskId, ActorIdentity $actor): AdmittedSeat
    {
        $this->locks->lockExclusive([AssigneeIdentity::ofActorIdentity($actor)]);
        $desk = DeskRecord::ownForUpdate($deskId);
        $held = $this->heldSeat($desk, $actor);

        if ($held->isDefined()) {
            return new AdmittedSeat($desk, DeskSeat::ofDeskById($desk, $held->get()->record->id), $actor, $held);
        }

        $this->assertOneForwardingSeat($desk, $actor);

        $seat = DeskSeat::query()->ofDesk($desk)->vacant()->firstOr(
            fn () => throw SeatCapacityReached::forDesk($desk->id),
        );

        return new AdmittedSeat($desk, $seat, $actor, None::create());
    }

    public function replace(SeatChange $change): AdmittedSeatChange
    {
        $this->locks->lockExclusive([$change->expected->holder, AssigneeIdentity::ofActorIdentity($change->actor)]);
        $desk = DeskRecord::ownForUpdate($change->deskId);
        $seat = DeskSeat::ofDeskById($desk, $change->seatId);
        $before = $this->expectedOn($seat, $change->expected);
        $admitted = new AdmittedSeatChange($desk, $seat, $before, SeatOccupant::of($before), $change->actor);

        if (! $admitted->keepsTheOccupant()) {
            $this->assertOneForwardingSeat($desk, $change->actor);
        }

        return $admitted;
    }

    public function release(SeatRelease $release): AdmittedRelease
    {
        $this->locks->lockExclusive([$release->expected->holder]);
        $desk = DeskRecord::ownForUpdate($release->deskId);
        $seat = DeskSeat::ofDeskById($desk, $release->seatId);

        return new AdmittedRelease($desk, $seat, $this->expectedOn($seat, $release->expected));
    }

    /**
     * The seat's current assignment, when it is still the one the caller read.
     *
     * @throws SeatConflict
     */
    private function expectedOn(DeskSeat $seat, AssignmentReference $expected): Assignment
    {
        $current = $this->store->lockCurrent($seat->assignmentIdentity());

        if ($current->isEmpty() || ! $current->get()->reference->isSameAs($expected)) {
            throw SeatConflict::forSeat($seat->id);
        }

        return $current->get();
    }

    /**
     * The assignment of the seat the actor already holds at the desk, if any.
     *
     * @return Option<Assignment>
     */
    private function heldSeat(DeskRecord $desk, ActorIdentity $actor): Option
    {
        $held = AssignmentRecord::query()
            ->assignedAmong(DeskSeat::LINK_TYPE, DeskSeat::query()->ofDesk($desk)->select('id'))
            ->heldBy(AssigneeIdentity::ofActorIdentity($actor))
            ->first();

        return $held === null ? None::create() : Some::create($held->toAssignment());
    }

    /**
     * An actor forwards to one desk at most: a forwarding desk refuses an actor seated at another forwarding desk.
     *
     * @throws SecondForwardingSeat
     */
    private function assertOneForwardingSeat(DeskRecord $desk, ActorIdentity $actor): void
    {
        if (! $desk->forwards_occupants) {
            return;
        }

        if (DeskRecord::query()->occupiedBy($actor)->forwarding()->whereKeyNot($desk->id)->exists()) {
            throw SecondForwardingSeat::forDesk($desk->id);
        }
    }
}
