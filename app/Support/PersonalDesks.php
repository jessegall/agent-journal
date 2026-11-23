<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Assignments\ResponsibilityWriter;
use App\Contracts\Chat\ActorDesks;
use App\Models\Desks\DeskSeat;

/**
 * Opens an actor's personal desk, seats the actor in its one seat and makes it the actor's preferred desk. The desk
 * and seat are new, so no other seating can race this one; it writes in the caller's transaction.
 */
final readonly class PersonalDesks implements ActorDesks
{
    public function __construct(
        private ResponsibilityWriter $responsibilities,
        private DeskPreferences $preferences,
        private DeskOpening $desks,
    ) {}

    public function provision(ActorIdentity $actor, string $label): SeatChangeResult
    {
        $desk = $this->desks->openPersonal($label);
        $seat = DeskSeat::query()->ofDesk($desk)->sole();

        $seated = $this->responsibilities->assign(
            $seat->assignmentIdentity(),
            AssigneeIdentity::ofActorIdentity($actor),
        );

        $desk->advanceSeating();
        $this->preferences->prefer($actor, $desk);

        return SeatChangeResult::at($desk, $seat->id, $seated->reference);
    }
}
