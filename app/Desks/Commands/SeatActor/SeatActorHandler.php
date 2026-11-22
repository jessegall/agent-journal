<?php

declare(strict_types=1);

namespace App\Desks\Commands\SeatActor;

use App\Contracts\CommandHandler;
use App\Desks\Support\DeskSeating;
use App\Desks\Support\SeatChangeResult;

final readonly class SeatActorHandler implements CommandHandler
{
    public function __construct(private DeskSeating $seating) {}

    public function handle(SeatActorCommand $command): SeatChangeResult
    {
        return $this->seating->seat($command->deskId, $command->actor);
    }
}
