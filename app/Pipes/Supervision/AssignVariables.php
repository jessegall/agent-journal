<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Contracts\Bus\Pipe;
use App\Enums\ExitStatus;
use App\Support\Execution\PartToRun;
use App\Support\Execution\StepOutcome;

/**
 * A line of only variable assignments sets them in the shell context for the steps after it.
 */
final readonly class AssignVariables implements Pipe
{
    public function handle(PartToRun $toRun): StepOutcome
    {
        return new StepOutcome(
            ExitStatus::Success->status(),
            $toRun->context->withEnvironment([...$toRun->context->environment, ...$toRun->assignments()]),
        );
    }
}
