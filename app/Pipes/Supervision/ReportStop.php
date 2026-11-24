<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Contracts\Bus\Pipe;
use App\Support\Execution\RunEnded;
use App\Support\Execution\StepOutcome;

/**
 * Records that the run was stopped, with the reason, when a stop was asked for; hands on the root step's outcome.
 */
final readonly class ReportStop implements Pipe
{
    public function handle(RunEnded $run): StepOutcome
    {
        if ($run->state->stop->isRequested()) {
            $run->state->events->runStopped($run->state->stop->reason());
        }

        return $run->outcome;
    }
}
