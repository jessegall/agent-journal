<?php

declare(strict_types=1);

namespace App\Projects\Commands\FinishProjectCommandRun;

use App\Bus\Contracts\CommandHandler;
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
