<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Commands\RetryDriverSwitch;

use App\Bus\Contracts\CommandHandler;
use App\Models\Drivers\DriverSwitch;

final readonly class RetryDriverSwitchHandler implements CommandHandler
{
    public function handle(RetryDriverSwitchCommand $command): void
    {
        DriverSwitch::findLockedById($command->switchId)->retryStart();
    }
}
