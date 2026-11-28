<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Bus\Contracts\Pipe;
use App\Support\Execution\StepOutcome;
use App\Support\Execution\PendingSteps;

/**
 * Hands on a sequence's outcome: the last step's status and context, and every step's output.
 */
final readonly class EndInOrder implements Pipe
{
    public function handle(PendingSteps $steps): StepOutcome
    {
        return $steps->outcome;
    }
}
