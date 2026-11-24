<?php

declare(strict_types=1);

namespace App\Commands\CreateDesk;

use App\Contracts\Bus\CommandHandler;
use App\Support\DeskService;

final readonly class CreateDeskHandler implements CommandHandler
{
    public function __construct(private DeskService $desks) {}

    public function handle(CreateDeskCommand $command): string
    {
        return $this->desks->openShared($command->label, $command->seatCount, $command->forwardsOccupants)->id;
    }
}
