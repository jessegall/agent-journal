<?php

declare(strict_types=1);

namespace App\Commands\FailDriverSwitchLaunch;

use App\Contracts\Bus\CommandHandler;
use App\Models\Drivers\DriverSwitch;

final readonly class FailDriverSwitchLaunchHandler implements CommandHandler
{
    public function handle(FailDriverSwitchLaunchCommand $command): void
    {
        $switch = DriverSwitch::lockedById($command->switchId);
        $switch->failLaunch($command->reason);
    }
}
