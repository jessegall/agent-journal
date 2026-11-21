<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\RetryDriverSwitch;
use App\Agents\Models\DriverSwitch;
use App\Contracts\CommandHandler;

final readonly class RetryDriverSwitchHandler implements CommandHandler
{
    public function handle(RetryDriverSwitch $command): void
    {
        DriverSwitch::query()->whereKey($command->switchId)->lockForUpdate()->firstOrFail()->retryLaunch();
    }
}
