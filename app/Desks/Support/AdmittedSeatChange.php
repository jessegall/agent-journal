<?php

declare(strict_types=1);

namespace App\Desks\Support;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Support\Assignment;
use App\Desks\Models\DeskRecord;
use App\Desks\Models\DeskSeat;

/**
 * An admitted replacement at a locked desk: the seat, its current assignment, and the actor leaving and arriving.
 */
final readonly class AdmittedSeatChange
{
    public function __construct(
        public DeskRecord $desk,
        public DeskSeat $seat,
        public Assignment $before,
        public ActorIdentity $oldActor,
        public ActorIdentity $newActor,
    ) {}

    public function keepsTheOccupant(): bool
    {
        return $this->oldActor->isSameAs($this->newActor);
    }
}
