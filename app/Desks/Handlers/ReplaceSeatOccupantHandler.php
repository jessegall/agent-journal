<?php

declare(strict_types=1);

namespace App\Desks\Handlers;

use App\Contracts\CommandHandler;
use App\Desks\Commands\ReplaceSeatOccupant;
use App\Desks\Contracts\SeatingWriter;
use App\Desks\Support\SeatChange;
use App\Desks\Support\SeatChangeResult;

final readonly class ReplaceSeatOccupantHandler implements CommandHandler
{
    public function __construct(private SeatingWriter $seating) {}

    public function handle(ReplaceSeatOccupant $command): SeatChangeResult
    {
        return $this->seating->replace(
            new SeatChange($command->deskId, $command->seatId, $command->expected, $command->actor),
        );
    }
}
