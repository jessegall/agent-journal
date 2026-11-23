<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Assignments\AssignmentStorage;
use App\Contracts\Chat\MainSeatTakeover;
use App\Models\Agents\Agent;
use App\Models\Desks\DeskRecord;
use App\Models\Desks\DeskSeat;

/**
 * The main start's seat change: the starting agent takes main's one seat. A different agent that held it is fenced,
 * so its runtimes and credentials stop; the same agent restarting keeps its seat. An ordinary runtime start never
 * comes here, so it grants no seat.
 */
final readonly class MainTakeover implements MainSeatTakeover
{
    public function __construct(
        private DeskSeating $seating,
        private AssignmentStorage $store,
    ) {}

    public function takeOver(Agent $agent): void
    {
        $main = DeskRecord::query()->named(BuiltInDesks::MAIN)->sole();
        $seat = DeskSeat::query()->ofDesk($main)->sole();
        $current = $this->store->lockCurrent($seat->assignmentIdentity());
        $starter = ActorIdentity::of($agent);

        if ($current->isEmpty()) {
            $this->seating->seat($main->id, $starter);

            return;
        }

        $former = SeatOccupant::of($current->get());

        if ($former->isSameAs($starter)) {
            return;
        }

        $this->seating->replace(new SeatChange($main->id, $seat->id, $current->get()->reference, $starter));
        Agent::withId($former->id)->forAll(fn (Agent $agent) => $agent->fenceRuntimes());
    }
}
