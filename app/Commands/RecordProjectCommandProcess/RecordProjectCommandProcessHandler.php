<?php

declare(strict_types=1);

namespace App\Commands\RecordProjectCommandProcess;

use App\Contracts\CommandHandler;
use App\Models\ProjectCommandRun;

final readonly class RecordProjectCommandProcessHandler implements CommandHandler
{
    public function handle(RecordProjectCommandProcessCommand $command): void
    {
        foreach (ProjectCommandRun::lockByRequest($command->requestKey) as $run) {
            $run->recordProcess($command->pid);
        }
    }
}
