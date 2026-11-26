<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Bus\Contracts\Pipe;
use App\Processes\Grammar\SubstitutionQueue;
use App\Processes\Grammar\UnparsedSubstitutions;

/**
 * Queues the segments of a word to search for substitutions.
 */
final readonly class QueueWordSegments implements Pipe
{
    public function handle(UnparsedSubstitutions $toParse): SubstitutionQueue
    {
        return SubstitutionQueue::of($toParse);
    }
}
