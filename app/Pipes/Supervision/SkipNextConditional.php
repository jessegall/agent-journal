<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Contracts\Bus\Pipe;
use App\Support\Execution\ConditionalSteps;

/**
 * Records every part of the next step of an && or || list as skipped, with the status that decided it.
 */
final readonly class SkipNextConditional implements Pipe
{
    public function handle(ConditionalSteps $steps): ConditionalSteps
    {
        $steps->state->skipEveryPart($steps->remaining[0], $steps->skipReason());

        return $steps->skippingNext();
    }
}
