<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Bus\Pipe;
use App\Support\Grammar\SubstitutionQueue;
use App\Support\Grammar\UnparsedSubstitutions;

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
