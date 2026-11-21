<?php

declare(strict_types=1);

namespace App\Connections\Handlers;

use App\Connections\Commands\FinishProjectCommandRun;
use App\Connections\Models\ProjectCommandRun;
use App\Contracts\CommandHandler;

final readonly class FinishProjectCommandRunHandler implements CommandHandler
{
    public function handle(FinishProjectCommandRun $command): void
    {
        foreach (ProjectCommandRun::lockByRequest($command->requestId) as $run) {
            $run->finish($command->frames, $command->exitCode);
        }
    }
}
