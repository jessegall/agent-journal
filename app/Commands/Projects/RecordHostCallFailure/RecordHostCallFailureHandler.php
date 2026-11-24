<?php

declare(strict_types=1);

namespace App\Commands\Projects\RecordHostCallFailure;

use App\Contracts\Bus\CommandHandler;
use App\Models\Projects\Host;
use Carbon\CarbonImmutable;

final readonly class RecordHostCallFailureHandler implements CommandHandler
{
    public function handle(RecordHostCallFailureCommand $command): void
    {
        Host::query()->lockForUpdate()->findOrFail($command->hostId)->recordCallFailure(
            $command->route,
            $command->status,
            $command->reason,
            CarbonImmutable::now(),
        );
    }
}
