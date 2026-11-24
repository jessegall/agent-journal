<?php

declare(strict_types=1);

namespace App\Commands\ReplaceSeatOccupant;

use App\Contracts\Bus\CommandHandler;
use App\Support\DeskSeatService;
use App\Support\SeatChange;
use App\Support\SeatChangeResult;

final readonly class ReplaceSeatOccupantHandler implements CommandHandler
{
    public function __construct(private DeskSeatService $seating) {}

    public function handle(ReplaceSeatOccupantCommand $command): SeatChangeResult
    {
        return $this->seating->replace(
            new SeatChange($command->deskId, $command->seatId, $command->expected, $command->actor),
        );
    }
}
