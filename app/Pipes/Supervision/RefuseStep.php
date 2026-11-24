<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Contracts\Bus\Pipe;
use App\Exceptions\SupervisorRefused;
use App\Support\Execution\PendingStep;
use App\Support\Execution\StepOutcome;

/**
 * A command substitution runs only as part of the command that uses it, never as a step of its own.
 */
final readonly class RefuseStep implements Pipe
{
    public function handle(PendingStep $toRun): StepOutcome
    {
        throw SupervisorRefused::stepNotRun($toRun->step->type);
    }
}
