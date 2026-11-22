<?php

declare(strict_types=1);

namespace App\Search\Values;

use App\Search\Contracts\BatchOutcome;
use App\Search\Enums\FailureReason;

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
