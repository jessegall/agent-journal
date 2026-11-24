<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Contracts\Bus\Pipe;
use App\Support\Execution\StepsInOrder;
use App\Support\Execution\StepToRun;

/**
 * Lines up a sequence's steps, starting from a success in the step's own context.
 */
final readonly class StartInOrder implements Pipe
{
    public function handle(StepToRun $toRun): StepsInOrder
    {
        return $toRun->inOrder();
    }
}
