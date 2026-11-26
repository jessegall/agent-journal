<?php

declare(strict_types=1);

namespace App\Projects\Commands\RecordProjectCommandProcess;

use App\Bus\Contracts\CommandHandler;
use App\Models\Projects\ProjectCommandRun;

final readonly class RecordProjectCommandProcessHandler implements CommandHandler
{
    public function handle(RecordProjectCommandProcessCommand $command): void
    {
        foreach (ProjectCommandRun::findLockedByRequest($command->requestKey) as $run) {
            $run->recordProcess($command->pid);
        }
    }
}
