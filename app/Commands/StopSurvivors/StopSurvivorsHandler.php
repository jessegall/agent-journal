<?php

declare(strict_types=1);

namespace App\Commands\StopSurvivors;

use App\Contracts\Bus\CommandHandler;
use App\Exceptions\RetryRefused;
use App\Models\Runs\ProcessRun;

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
