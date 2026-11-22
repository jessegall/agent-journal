<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\BatchOutcome;

/**
 * The source reread the candidates it was asked about: each hit answers one of them, and one left out is dropped.
 */
final readonly class RefreshedOutcome implements BatchOutcome
{
    public function carriesHits(): bool
    {
        return true;
    }

    public function name(): string
    {
        return 'refreshed';
    }
}
