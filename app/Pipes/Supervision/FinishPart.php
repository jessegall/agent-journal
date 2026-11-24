<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Contracts\Bus\Pipe;
use App\Support\Execution\DrainedPart;
use App\Support\Execution\StepOutcome;

/**
 * Ends a drained part and gives its step the part's status and the output it kept.
 */
final readonly class FinishPart implements Pipe
{
    public function handle(DrainedPart $drained): StepOutcome
    {
        $status = $drained->spawned->end($drained->isDrained);

        return new StepOutcome($status, $drained->spawned->queued->context, $drained->stdout);
    }
}
