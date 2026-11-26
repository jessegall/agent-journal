<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Commands\FailDriverSwitchStart;

use App\Bus\Contracts\CommandHandler;
use App\Models\Drivers\DriverSwitch;

final readonly class FailDriverSwitchStartHandler implements CommandHandler
{
    public function handle(FailDriverSwitchStartCommand $command): void
    {
        $switch = DriverSwitch::findLockedById($command->switchId);
        $switch->failStart($command->reason);
    }
}
