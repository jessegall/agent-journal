<?php

declare(strict_types=1);

namespace App\Desks\Support;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\ResponsibilityWriter;
use App\Assignments\Support\AssigneeIdentity;
use App\Desks\Contracts\ActorDesks;
use App\Desks\Models\DeskPreference;
use App\Desks\Models\DeskRecord;
use App\Desks\Models\DeskSeat;

/**
 * Opens an actor's personal desk, seats the actor in its one seat and makes it the actor's preferred desk. The desk
 * and seat are new, so no other seating can race this one; it writes in the caller's transaction.
 */
final readonly class PersonalDesks implements ActorDesks
{
    public function __construct(
        private ResponsibilityWriter $responsibilities,
    ) {}

    public function provision(ActorIdentity $actor, string $label): SeatChangeResult
    {
        $desk = DeskRecord::openPersonal($label);
        $seat = DeskSeat::query()->ofDesk($desk)->sole();
        $seated = $this->responsibilities->assign(
            $seat->assignmentIdentity(),
            AssigneeIdentity::ofActorIdentity($actor),
        );
        $desk->advanceSeating();
        DeskPreference::prefer($actor, $desk);

        return SeatChangeResult::at($desk, $seat->id, $seated->reference);
    }
}
