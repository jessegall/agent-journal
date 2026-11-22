<?php

declare(strict_types=1);

namespace App\Desks\Commands\ReplaceSeatOccupant;

use App\Contracts\CommandHandler;
use App\Desks\Support\DeskSeating;
use App\Desks\Support\SeatChange;
use App\Desks\Support\SeatChangeResult;

final readonly class ReplaceSeatOccupantHandler implements CommandHandler
{
    public function __construct(private DeskSeating $seating) {}

    public function handle(ReplaceSeatOccupantCommand $command): SeatChangeResult
    {
        return $this->seating->replace(
            new SeatChange($command->deskId, $command->seatId, $command->expected, $command->actor),
        );
    }
}
