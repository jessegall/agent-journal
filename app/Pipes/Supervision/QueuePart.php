<?php

declare(strict_types=1);

namespace App\Pipes\Supervision;

use App\Contracts\Bus\Pipe;
use App\Support\Execution\PartToRun;
use App\Support\Execution\QueuedPart;

/**
 * Queues a part under the next attempt of its syntax node, with no standard input of its own.
 */
final readonly class QueuePart implements Pipe
{
    public function handle(PartToRun $toRun): QueuedPart
    {
        return new QueuedPart(
            $toRun->step,
            $toRun->state->queue($toRun->step),
            $toRun->context,
            $toRun->state,
            $toRun->substitutionOutputs,
            QueuedPart::NO_INPUT,
        );
    }
}
