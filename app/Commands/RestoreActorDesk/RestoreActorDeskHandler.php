<?php

declare(strict_types=1);

namespace App\Commands\RestoreActorDesk;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Chat\ActorDesks;
use App\Models\DeskRecord;
use App\Models\DeskSeat;
use App\Support\DeskSeating;
use App\Support\SeatChangeResult;
use App\Support\SeatLossRepair;

final readonly class RestoreActorDeskHandler implements CommandHandler
{
    public function __construct(
        private DeskSeating $seating,
        private ActorDesks $desks,
    ) {}

    public function handle(RestoreActorDeskCommand $command): SeatChangeResult
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
