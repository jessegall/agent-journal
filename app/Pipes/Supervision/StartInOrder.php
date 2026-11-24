<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Contracts\Bus\Pipe;
use App\Support\Execution\PendingStep;
use App\Support\Execution\StepsInOrder;

/**
 * Lines up a sequence's steps, starting from a success in the step's own context.
 */
final readonly class StartInOrder implements Pipe
{
    public function handle(PendingStep $toRun): StepsInOrder
    {
        return $toRun->inOrder();
    }
}
