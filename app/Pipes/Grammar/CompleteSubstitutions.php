<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Bus\Pipe;
use App\Support\Grammar\SubstitutionQueue;
use App\Support\Grammar\SubstitutionsRead;

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
