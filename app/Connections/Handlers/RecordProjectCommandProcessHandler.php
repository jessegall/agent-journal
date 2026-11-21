<?php

declare(strict_types=1);

namespace App\Connections\Handlers;

use App\Connections\Commands\RecordProjectCommandProcess;
use App\Connections\Models\ProjectCommandRun;
use App\Contracts\CommandHandler;

final readonly class RecordProjectCommandProcessHandler implements CommandHandler
{
    public function handle(RecordProjectCommandProcess $command): void
    {
        foreach (ProjectCommandRun::lockByRequest($command->requestId) as $run) {
            $run->recordProcess($command->pid);
        }
    }
}
