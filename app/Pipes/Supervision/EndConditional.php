<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Bus\Contracts\Pipe;
use App\Support\Execution\PendingSteps;
use App\Support\Execution\StepOutcome;

/**
 * Hands on an && or || list's outcome: the status of the last step that ran.
 */
final readonly class EndConditional implements Pipe
{
    public function handle(PendingSteps $steps): StepOutcome
    {
        return $steps->outcome;
    }
}
