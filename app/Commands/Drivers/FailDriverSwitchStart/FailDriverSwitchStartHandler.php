<?php

declare(strict_types=1);

namespace App\Commands\Drivers\FailDriverSwitchStart;

use App\Contracts\Bus\CommandHandler;
use App\Models\Drivers\DriverSwitch;

final readonly class FailDriverSwitchStartHandler implements CommandHandler
{
    public function handle(FailDriverSwitchStartCommand $command): void
    {
        $switch = DriverSwitch::lockedById($command->switchId);
        $switch->failLaunch($command->reason);
    }
}
