<?php

declare(strict_types=1);

namespace App\Desks\Handlers;

use App\Contracts\CommandHandler;
use App\Desks\Commands\SeatActor;
use App\Desks\Contracts\SeatingWriter;
use App\Desks\Support\SeatChangeResult;

final readonly class SeatActorHandler implements CommandHandler
{
    public function __construct(private SeatingWriter $seating) {}

    public function handle(SeatActor $command): SeatChangeResult
    {
        return $this->seating->seat($command->deskId, $command->actor);
    }
}
