<?php

declare(strict_types=1);

namespace App\Desks\Support;

use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\MainDesk;
use App\Agents\Models\NavigationRequest;
use App\Assignments\Contracts\AssignmentStorage;
use App\Assignments\Contracts\ResponsibilityWriter;
use App\Assignments\Models\AssignmentRecord;
use App\Desks\Models\DeskRecord;
use App\Desks\Models\DeskSeat;
use PhpOption\Option;

/**
 * The main desk's side of navigation: its one seat's occupant, and the navigation requests it holds as Core's own
 * responsibility, which no public assignment changes.
 */
final readonly class MainDeskNavigation implements MainDesk
{
    public function __construct(
        private AssignmentStorage $store,
        private ResponsibilityWriter $responsibilities,
    ) {}

    public function occupant(): Option
    {
        $seat = DeskSeat::query()->ofDesk($this->main())->sole();

        return $this->store->lockCurrent($seat->assignmentIdentity())->map(SeatOccupant::of(...));
    }

    public function receive(NavigationRequest $request): void
    {
        if ($this->store->lockCurrent($request->assignmentIdentity())->isDefined()) {
            return;
        }

        $this->responsibilities->assign($request->assignmentIdentity(), $this->main()->assigneeIdentity());
    }

    public function openRequestsFor(ActorIdentity $actor): int
    {
        if (! NavigationRequest::query()->acrossActors()->open()->exists()) {
            return 0;
        }
        $seated = $this->occupant()->map(fn (ActorIdentity $occupant) => $occupant->isSameAs($actor));

        if (! $seated->getOrElse(false)) {
            return 0;
        }
        $held = AssignmentRecord::query()->heldRecordIds(
            NavigationRequest::LINK_TYPE,
            $this->main()->assigneeIdentity(),
        );

        return NavigationRequest::query()->acrossActors()->open()->whereIn('id', $held)->count();
    }

    private function main(): DeskRecord
    {
        return DeskRecord::query()->named(BuiltInDesks::MAIN)->sole();
    }
}
