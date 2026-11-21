<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\RecordHostProtection;
use App\Agents\Models\Host;
use App\Contracts\CommandHandler;

final readonly class RecordHostProtectionHandler implements CommandHandler
{
    public function handle(RecordHostProtection $command): void
    {
        Host::query()->lockForUpdate()->findOrFail($command->hostId)->recordProtection($command->report);
    }
}
