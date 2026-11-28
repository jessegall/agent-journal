<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Bus\Contracts\Pipe;
use App\Support\Execution\PendingSteps;

/**
 * Records every part of the next step of an && or || list as skipped, with the status that decided it.
 */
final readonly class SkipNextConditional implements Pipe
{
    public function handle(PendingSteps $steps): PendingSteps
    {
        return $steps->skippingNext();
    }
}
