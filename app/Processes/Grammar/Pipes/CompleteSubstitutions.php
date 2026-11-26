<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Bus\Contracts\Pipe;
use App\Processes\Grammar\SubstitutionQueue;
use App\Processes\Grammar\SubstitutionsRead;

/**
 * Hands on the owner every substitution of the word was read into.
 */
final readonly class CompleteSubstitutions implements Pipe
{
    public function handle(SubstitutionQueue $queue): SubstitutionsRead
    {
        return new SubstitutionsRead($queue->owner);
    }
}
