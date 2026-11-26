<?php

declare(strict_types=1);

namespace App\Search\Values;

use App\Bus\Contracts\BatchOutcome;
use App\Values\SourcePosition;

/**
 * The source examined the whole remaining range: the hits it returned are all it has left.
 */
final readonly class ExhaustedOutcome implements BatchOutcome
{
    public function canCarryHits(): bool
    {
        return true;
    }

    public function name(): string
    {
        return 'exhausted';
    }

    public function isFailure(): bool
    {
        return false;
    }

    public function nextPosition(): SourcePosition|null
    {
        return null;
    }

    public function isLastBatch(): bool
    {
        return true;
    }
}
