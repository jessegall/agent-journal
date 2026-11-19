<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Contracts\CommandHandler;
use App\Processes\Commands\StopSurvivors;
use App\Processes\Exceptions\RetryRefused;
use App\Processes\Models\ProcessRun;

final readonly class StopSurvivorsHandler implements CommandHandler
{
    /**
     * @throws RetryRefused
     */
    public function handle(StopSurvivors $command): string
    {
        $run = ProcessRun::query()->acrossActors()->whereKey($command->runId)->lockForUpdate()->sole();
        $run->stopSurvivors();

        return $run->id;
    }
}
