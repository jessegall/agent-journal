<?php

declare(strict_types=1);

namespace App\Agents\Commands\FailDriverSwitchLaunch;

use App\Agents\Models\DriverSwitch;
use App\Contracts\CommandHandler;

final readonly class FailDriverSwitchLaunchHandler implements CommandHandler
{
    public function handle(FailDriverSwitchLaunchCommand $command): void
    {
        $switch = DriverSwitch::query()->whereKey($command->switchId)->lockForUpdate()->firstOrFail();
        $switch->failLaunch($command->reason);
    }
}
