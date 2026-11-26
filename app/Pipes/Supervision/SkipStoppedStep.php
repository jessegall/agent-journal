<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Bus\Contracts\Pipe;
use App\Processes\Enums\ExitStatus;
use App\Support\Execution\PendingStep;
use App\Support\Execution\StepOutcome;

/**
 * A step reached after a stop was asked for does not run: each of its parts is recorded as skipped.
 */
final readonly class SkipStoppedStep implements Pipe
{
    public function handle(PendingStep $run): StepOutcome
    {
        $run->state->skipEveryPart($run->step, 'the run was stopped: '.$run->state->stop->reason());

        return new StepOutcome(ExitStatus::Interrupted->status(), $run->context);
    }
}
