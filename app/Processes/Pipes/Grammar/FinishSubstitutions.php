<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Values\Grammar\SubstitutionQueue;
use App\Processes\Values\Grammar\SubstitutionsRead;

/**
 * Hands on the owner every substitution of the word was read into.
 */
final readonly class FinishSubstitutions implements Pipe
{
    public function handle(SubstitutionQueue $queue): SubstitutionsRead
    {
        return new SubstitutionsRead($queue->owner);
    }
}
