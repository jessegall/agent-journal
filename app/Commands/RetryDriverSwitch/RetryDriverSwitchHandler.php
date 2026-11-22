<?php

declare(strict_types=1);

namespace App\Commands\RetryDriverSwitch;

use App\Contracts\Bus\CommandHandler;
use App\Models\DriverSwitch;

final readonly class RetryDriverSwitchHandler implements CommandHandler
{
    public function handle(RetryDriverSwitchCommand $command): void
    {
        DriverSwitch::query()->whereKey($command->switchId)->lockForUpdate()->firstOrFail()->retryLaunch();
    }
}
