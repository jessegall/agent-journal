<?php

declare(strict_types=1);

namespace App\Commands\Projects\FinishProjectCommandRun;

use App\Contracts\Bus\CommandHandler;
use App\Models\Projects\ProjectCommandRun;

final readonly class FinishProjectCommandRunHandler implements CommandHandler
{
    public function handle(FinishProjectCommandRunCommand $command): void
    {
        foreach (ProjectCommandRun::findLockedByRequest($command->requestKey) as $run) {
            $run->finish($command->frames, $command->exitCode);
        }
    }
}
