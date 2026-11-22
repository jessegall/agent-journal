<?php

declare(strict_types=1);

namespace App\Processes\Commands\StopSurvivors;

use App\Contracts\CommandHandler;
use App\Processes\Exceptions\RetryRefused;
use App\Processes\Models\ProcessRun;

final readonly class StopSurvivorsHandler implements CommandHandler
{
    /**
     * @throws RetryRefused
     */
    public function handle(StopSurvivorsCommand $command): string
    {
        $run = ProcessRun::query()->acrossActors()->whereKey($command->runId)->lockForUpdate()->sole();
        $run->stopSurvivors();

        return $run->id;
    }
}
