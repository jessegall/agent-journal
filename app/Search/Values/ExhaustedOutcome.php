<?php

declare(strict_types=1);

namespace App\Search\Values;

use App\Search\Contracts\BatchOutcome;

/**
 * The source examined the whole remaining range: the hits it returned are all it has left.
 */
final readonly class ExhaustedOutcome implements BatchOutcome
{
    public function carriesHits(): bool
    {
        return true;
    }

    public function name(): string
    {
        return 'exhausted';
    }
}
