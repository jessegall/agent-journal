<?php

declare(strict_types=1);

namespace App\Desks\Commands\ReleaseSeat;

use App\Contracts\CommandHandler;
use App\Desks\Support\DeskSeating;
use App\Desks\Support\SeatRelease;

final readonly class ReleaseSeatHandler implements CommandHandler
{
    public function __construct(private DeskSeating $seating) {}

    public function handle(ReleaseSeatCommand $command): void
    {
        $this->seating->release(new SeatRelease($command->deskId, $command->seatId, $command->expected));
    }
}
