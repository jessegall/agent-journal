<?php

declare(strict_types=1);

namespace App\Desks\Handlers;

use App\Contracts\CommandHandler;
use App\Desks\Commands\CreateDesk;
use App\Desks\Models\DeskRecord;

final readonly class CreateDeskHandler implements CommandHandler
{
    public function handle(CreateDesk $command): string
    {
        return DeskRecord::openShared($command->label, $command->seatCount, $command->forwardsOccupants)->id;
    }
}
