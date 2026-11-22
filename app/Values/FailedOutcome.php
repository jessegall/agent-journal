<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\BatchOutcome;
use App\Enums\FailureReason;

/**
 * The source could not answer, for a reason safe to show. It carries no hits.
 */
final readonly class FailedOutcome implements BatchOutcome
{
    public function __construct(public FailureReason $reason) {}

    public function carriesHits(): bool
    {
        return false;
    }

    public function name(): string
    {
        return 'failed';
    }
}
