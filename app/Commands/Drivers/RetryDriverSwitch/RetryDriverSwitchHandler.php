<?php

declare(strict_types=1);

namespace App\Commands\Drivers\RetryDriverSwitch;

use App\Contracts\Bus\CommandHandler;
use App\Models\Drivers\DriverSwitch;

final readonly class RetryDriverSwitchHandler implements CommandHandler
{
    public function handle(RetryDriverSwitchCommand $command): void
    {
        DriverSwitch::lockedById($command->switchId)->retryStart();
    }
}
