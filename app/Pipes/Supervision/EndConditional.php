<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Contracts\Bus\Pipe;
use App\Support\Execution\ConditionalSteps;
use App\Support\Execution\StepOutcome;

/**
 * Hands on an && or || list's outcome: the status of the last step that ran.
 */
final readonly class EndConditional implements Pipe
{
    public function handle(ConditionalSteps $steps): StepOutcome
    {
        return $steps->outcome;
    }
}
