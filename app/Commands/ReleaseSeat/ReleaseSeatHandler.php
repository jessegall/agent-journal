<?php

declare(strict_types=1);

namespace App\Commands\ReleaseSeat;

use App\Contracts\CommandHandler;
use App\Support\DeskSeating;
use App\Support\SeatRelease;

final readonly class ReleaseSeatHandler implements CommandHandler
{
    public function __construct(private DeskSeating $seating) {}

    public function handle(ReleaseSeatCommand $command): void
    {
        $this->seating->release(new SeatRelease($command->deskId, $command->seatId, $command->expected));
    }
}
