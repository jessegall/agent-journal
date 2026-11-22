<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\BatchOutcome;

/**
 * The source has no hit it can publish yet and scans on from the next work position, which moved forward even when
 * this batch found nothing. It carries no hits.
 */
final readonly class ScanningOutcome implements BatchOutcome
{
    public function __construct(public SourcePosition $nextWork) {}

    public function carriesHits(): bool
    {
        return false;
    }

    public function name(): string
    {
        return 'scanning';
    }
}
