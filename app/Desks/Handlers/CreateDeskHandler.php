<?php

declare(strict_types=1);

namespace App\Desks\Handlers;

use App\Contracts\CommandHandler;
use App\Desks\Commands\CreateDesk;
use App\Desks\Support\DeskOpening;

final readonly class CreateDeskHandler implements CommandHandler
{
    public function __construct(private DeskOpening $desks) {}

    public function handle(CreateDesk $command): string
    {
        return $this->desks->openShared($command->label, $command->seatCount, $command->forwardsOccupants)->id;
    }
}
