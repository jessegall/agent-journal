<?php

declare(strict_types=1);

namespace App\Scripts\Handlers;

use App\Contracts\CommandHandler;
use App\Scripts\Commands\RecordScriptStepResult;
use App\Scripts\Models\ProfileRun;
use App\Scripts\Values\StepOutcome;

/**
 * Records the host's step outcome on the run that waits on it and resumes that run.
 */
final readonly class RecordScriptStepResultHandler implements CommandHandler
{
    public function handle(RecordScriptStepResult $command): void
    {
        ProfileRun::lockedForStep($command->runId)->recordStep(
            $command->stepReference,
            StepOutcome::reported($command->status, $command->port, $command->evidence),
        );
    }
}
