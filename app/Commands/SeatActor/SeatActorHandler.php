<?php

declare(strict_types=1);

namespace App\Commands\SeatActor;

use App\Contracts\Bus\CommandHandler;
use App\Support\DeskSeatService;
use App\Support\SeatChangeResult;

final readonly class SeatActorHandler implements CommandHandler
{
    public function __construct(private DeskSeatService $seating) {}

    public function handle(SeatActorCommand $command): SeatChangeResult
    {
        return $this->seating->seat($command->deskId, $command->actor);
    }
}
