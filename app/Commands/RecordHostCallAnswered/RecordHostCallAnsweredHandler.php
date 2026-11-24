<?php

declare(strict_types=1);

namespace App\Commands\RecordHostCallAnswered;

use App\Contracts\Bus\CommandHandler;
use App\Models\Projects\Host;
use Carbon\CarbonImmutable;

final readonly class RecordHostCallAnsweredHandler implements CommandHandler
{
    public function handle(RecordHostCallAnsweredCommand $command): void
    {
        Host::query()
            ->lockForUpdate()
            ->findOrFail($command->hostId)
            ->recordCallAnswered($command->route, $command->reportedFailures, CarbonImmutable::now());
    }
}
