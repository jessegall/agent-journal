<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Contracts\Bus\Pipe;
use App\Support\Execution\RunEnded;

/**
 * Waits for every background part before the run ends, each ended with its own status.
 */
final readonly class FinishBackground implements Pipe
{
    public function handle(RunEnded $run): RunEnded
    {
        foreach ($run->state->takeBackground() as $part) {
            $part->end(true);
        }

        return $run;
    }
}
