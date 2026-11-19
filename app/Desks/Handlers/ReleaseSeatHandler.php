<?php

declare(strict_types=1);

namespace App\Desks\Handlers;

use App\Contracts\CommandHandler;
use App\Desks\Commands\ReleaseSeat;
use App\Desks\Contracts\SeatingWriter;
use App\Desks\Support\SeatRelease;

final readonly class ReleaseSeatHandler implements CommandHandler
{
    public function __construct(private SeatingWriter $seating) {}

    public function handle(ReleaseSeat $command): void
    {
        $this->seating->release(new SeatRelease($command->deskId, $command->seatId, $command->expected));
    }
}
