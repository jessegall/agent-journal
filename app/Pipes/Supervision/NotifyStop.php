<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Bus\Contracts\Pipe;
use App\Support\Execution\RunEnded;
use App\Support\Execution\StepOutcome;

/**
 * Records that the run was stopped, with the reason, when a stop was asked for; hands on the root step's outcome.
 */
final readonly class NotifyStop implements Pipe
{
    public function handle(RunEnded $run): StepOutcome
    {
        $run->state->reportStop();

        return $run->outcome;
    }
}
