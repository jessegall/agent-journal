<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Contracts\Bus\Pipe;
use App\Support\Execution\PumpedCommands;
use App\Support\Execution\SpawnedPart;
use App\Support\Execution\StepOutcome;
use App\Support\Execution\StepStatus;

/**
 * Ends every command of a pipeline and gives the step the pipeline's status: the last command's, or with pipefail the
 * last failed one's.
 */
final readonly class FinishPipedCommands implements Pipe
{
    public function handle(PumpedCommands $pumped): StepOutcome
    {
        $toRun = $pumped->commands->toRun;
        $statuses = array_map(fn (SpawnedPart $part) => $part->end(true), $pumped->commands->started);

        $status = StepStatus::ofPipeline($statuses, $toRun->context->pipefail);

        return new StepOutcome($status, $toRun->context, $pumped->stdout);
    }
}
