<?php

declare(strict_types=1);

namespace App\Commands\FailDriverSwitchLaunch;

use App\Contracts\CommandHandler;
use App\Models\DriverSwitch;

final readonly class FailDriverSwitchLaunchHandler implements CommandHandler
{
    public function handle(FailDriverSwitchLaunchCommand $command): void
    {
        $switch = DriverSwitch::query()->whereKey($command->switchId)->lockForUpdate()->firstOrFail();
        $switch->failLaunch($command->reason);
    }
}
