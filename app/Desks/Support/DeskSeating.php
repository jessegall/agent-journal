<?php

declare(strict_types=1);

namespace App\Desks\Support;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\ResponsibilityWriter;
use App\Assignments\Support\AssigneeIdentity;
use App\Desks\Contracts\SeatAdmission;
use App\Desks\Contracts\SeatingWriter;

/**
 * Seats, replaces and releases desk occupants through Core's own responsibility writer, advancing the desk's seating
 * revision with every change and giving an actor that lost its last seat a new personal desk. Claim release and
 * occupant attention join here as their own constructor-injected contracts.
 */
final readonly class DeskSeating implements SeatingWriter
{
    public function __construct(
        private SeatAdmission $admission,
        private ResponsibilityWriter $responsibilities,
        private SeatLossRepair $repair,
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

        $after = $this->responsibilities->replace(
            $admitted->seat->assignmentIdentity(),
            $admitted->before->reference,
            AssigneeIdentity::ofActorIdentity($admitted->newActor),
        );
        $admitted->desk->advanceSeating();
        $this->repair->afterLoss($admitted->oldActor, $admitted->desk);

        return SeatChangeResult::at($admitted->desk, $admitted->seat->id, $after->reference);
    }

    public function release(SeatRelease $release): void
    {
        $admitted = $this->admission->release($release);
        $this->responsibilities->release($admitted->seat->assignmentIdentity(), $admitted->before->reference);
        $admitted->desk->advanceSeating();
        $this->repair->afterLoss(SeatOccupant::of($admitted->before), $admitted->desk);
    }
}
