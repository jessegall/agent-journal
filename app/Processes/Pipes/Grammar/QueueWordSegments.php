<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Values\Grammar\SubstitutionQueue;
use App\Processes\Values\Grammar\SubstitutionsReading;

/**
 * Queues the segments of a word to search for substitutions.
 */
final readonly class QueueWordSegments implements Pipe
{
    public function handle(SubstitutionsReading $reading): SubstitutionQueue
    {
        return SubstitutionQueue::of($reading);
    }
}
