<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Pipe;
use App\Support\Grammar\SubstitutionQueue;
use App\Support\Grammar\SubstitutionsToParse;

/**
 * Queues the segments of a word to search for substitutions.
 */
final readonly class QueueWordSegments implements Pipe
{
    public function handle(SubstitutionsToParse $toParse): SubstitutionQueue
    {
        return SubstitutionQueue::of($toParse);
    }
}
