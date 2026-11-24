<?php

declare(strict_types=1);

namespace App\Commands\Projects\RecordHostProtection;

use App\Contracts\Bus\CommandHandler;
use App\Models\Projects\Host;

final readonly class RecordHostProtectionHandler implements CommandHandler
{
    public function handle(RecordHostProtectionCommand $command): void
    {
        Host::query()->lockForUpdate()->findOrFail($command->hostId)->recordProtection($command->report);
    }
}
