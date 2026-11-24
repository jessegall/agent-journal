<?php

declare(strict_types=1);

namespace App\Commands\Desks\ReleaseSeat;

use App\Contracts\Bus\CommandHandler;
use App\Support\DeskSeatService;
use App\Support\SeatRelease;

final readonly class ReleaseSeatHandler implements CommandHandler
{
    public function __construct(private DeskSeatService $seating) {}

    public function handle(ReleaseSeatCommand $command): void
    {
        $this->seating->release(new SeatRelease($command->deskId, $command->seatId, $command->expected));
    }
}
