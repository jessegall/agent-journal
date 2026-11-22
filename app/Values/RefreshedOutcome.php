<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\Bus\BatchOutcome;

/**
 * The source reread the candidates it was asked about: each hit answers one of them, and one left out is dropped.
 */
final readonly class RefreshedOutcome implements BatchOutcome
{
    public function canCarryHits(): bool
    {
        return true;
    }

    public function name(): string
    {
        return 'refreshed';
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
        return false;
    }
}
