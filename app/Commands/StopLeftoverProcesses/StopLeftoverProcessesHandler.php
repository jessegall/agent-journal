<?php

declare(strict_types=1);

namespace App\Commands\StopLeftoverProcesses;

use App\Contracts\Bus\CommandHandler;
use App\Exceptions\RetryRefused;
use App\Models\Runs\ProcessRun;

final readonly class StopLeftoverProcessesHandler implements CommandHandler
{
    /**
     * @throws RetryRefused
     */
    public function handle(StopLeftoverProcessesCommand $command): string
    {
        $run = ProcessRun::query()->acrossActors()->whereKey($command->runId)->lockForUpdate()->sole();
        $run->stopLeftoverProcesses();

        return $run->id;
    }
}
