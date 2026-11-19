<?php

declare(strict_types=1);

namespace App\Desks\Handlers;

use App\Contracts\CommandHandler;
use App\Desks\Commands\RestoreActorDesk;
use App\Desks\Contracts\ActorDesks;
use App\Desks\Contracts\SeatingWriter;
use App\Desks\Models\DeskRecord;
use App\Desks\Models\DeskSeat;
use App\Desks\Support\SeatChangeResult;
use App\Desks\Support\SeatLossRepair;

final readonly class RestoreActorDeskHandler implements CommandHandler
{
    public function __construct(
        private SeatingWriter $seating,
        private ActorDesks $desks,
    ) {}

    public function handle(RestoreActorDesk $command): SeatChangeResult
    {
        $preferred = DeskRecord::preferredBy($command->actor)
            ->filter(fn (DeskRecord $desk) => $desk->isPersonal())
            ->filter(fn (DeskRecord $desk) => DeskSeat::query()->ofDesk($desk)->vacant()->exists());

        if ($preferred->isDefined()) {
            return $this->seating->seat($preferred->get()->id, $command->actor);
        }

        return $this->desks->provision($command->actor, SeatLossRepair::PERSONAL_LABEL);
    }
}
