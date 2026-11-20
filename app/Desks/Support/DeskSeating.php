<?php

declare(strict_types=1);

namespace App\Desks\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\AssignmentFactPublisher;
use App\Assignments\Contracts\ClaimRelease;
use App\Assignments\Contracts\ResponsibilityWriter;
use App\Assignments\Enums\AssignmentReason;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\Assignment;
use App\Assignments\Support\AssignmentChange;
use App\Assignments\Support\AssignmentResult;

/**
 * Seats, replaces and releases desk occupants through Core's own responsibility writer, advancing the desk's seating
 * revision with every change, ending the claims a lost seat proved, and giving an actor that lost its last seat a
 * new personal desk. Occupant attention joins here as its own constructor-injected contract.
 */
final readonly class DeskSeating
{
    public function __construct(
        private DeskSeatAdmission $admission,
        private ResponsibilityWriter $responsibilities,
        private SeatLossRepair $repair,
        private ClaimRelease $claims,
        private AssignmentFactPublisher $facts,
        private CurrentActor $actors,
    ) {}

    public function seat(string $deskId, ActorIdentity $actor): SeatChangeResult
    {
        $admitted = $this->admission->seat($deskId, $actor);

        if ($admitted->held->isDefined()) {
            return SeatChangeResult::at($admitted->desk, $admitted->seat->id, $admitted->held->get()->reference);
        }

        $after = $this->responsibilities->assign(
            $admitted->seat->assignmentIdentity(),
            AssigneeIdentity::ofActorIdentity($actor),
        );
        $admitted->desk->advanceSeating();

        return SeatChangeResult::at($admitted->desk, $admitted->seat->id, $after->reference);
    }

    public function replace(SeatChange $change): SeatChangeResult
    {
        $admitted = $this->admission->replace($change);

        if ($admitted->keepsTheOccupant()) {
            return SeatChangeResult::at($admitted->desk, $admitted->seat->id, $admitted->before->reference);
        }

        $this->claims->releaseAuthorizedBy($admitted->before->reference);
        $after = $this->responsibilities->replace(
            $admitted->seat->assignmentIdentity(),
            $admitted->before->reference,
            AssigneeIdentity::ofActorIdentity($admitted->newActor),
        );
        $admitted->desk->advanceSeating();
        $this->publishSeatChange(AssignmentReason::Reassigned, $admitted->before, $after);
        $this->repair->afterLoss($admitted->oldActor, $admitted->desk);

        return SeatChangeResult::at($admitted->desk, $admitted->seat->id, $after->reference);
    }

    public function release(SeatRelease $release): void
    {
        $admitted = $this->admission->release($release);
        $this->claims->releaseAuthorizedBy($admitted->before->reference);
        $this->responsibilities->release($admitted->seat->assignmentIdentity(), $admitted->before->reference);
        $admitted->desk->advanceSeating();
        $this->publishSeatChange(AssignmentReason::Unassigned, $admitted->before, null);
        $this->repair->afterLoss(SeatOccupant::of($admitted->before), $admitted->desk);
    }

    /**
     * One fact after commit that names the lost seat assignment, for every view that counted its claims.
     */
    private function publishSeatChange(AssignmentReason $reason, Assignment $before, Assignment|null $after): void
    {
        $this->facts->publish(
            ActorIdentity::of($this->actors->actor()),
            $reason,
            new AssignmentResult([], [new AssignmentChange($before->record, $before, $after)]),
        );
    }
}
