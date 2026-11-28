<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Bus\Contracts\Pipe;
use App\Processes\Execution\SpawnedPart;
use App\Processes\Execution\StepStatus;
use App\Support\Execution\PipedCommands;
use App\Support\Execution\StepOutcome;

/**
 * Ends every command of a pipeline and gives the step the pipeline's status: the last command's, or with pipefail the
 * last failed one's.
 */
final readonly class FinishPipedCommands implements Pipe
{
    public function handle(PipedCommands $pumped): StepOutcome
    {
        $toRun = $pumped->toRun;
        $statuses = array_map(fn (SpawnedPart $part) => $part->end(true), $pumped->started);

        $status = StepStatus::ofPipeline($statuses, $toRun->context->isPipefail);

        return new StepOutcome($status, $toRun->context, $pumped->stdout);
    }
}
