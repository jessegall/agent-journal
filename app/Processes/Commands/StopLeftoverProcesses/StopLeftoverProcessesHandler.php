<?php

declare(strict_types=1);

namespace App\Processes\Commands\StopLeftoverProcesses;

use App\Bus\Contracts\CommandHandler;
use App\Models\Runs\ProcessRun;
use App\Processes\Exceptions\RetryRefused;

final readonly class StopLeftoverProcessesHandler implements CommandHandler
{
    /**
     * @throws RetryRefused
     */
    public function handle(StopLeftoverProcessesCommand $command): string
    {
        $run = ProcessRun::query()->acrossActors()->whereKey($command->runId)->lockForUpdate()->sole();
        $run->stopLeftoverProcesses();

        return $run->getKey();
    }
}
