<?php

declare(strict_types=1);

namespace App\Agents\Commands\RetryDriverSwitch;

use App\Agents\Models\DriverSwitch;
use App\Contracts\CommandHandler;

final readonly class RetryDriverSwitchHandler implements CommandHandler
{
    public function handle(RetryDriverSwitchCommand $command): void
    {
        DriverSwitch::query()->whereKey($command->switchId)->lockForUpdate()->firstOrFail()->retryLaunch();
    }
}
