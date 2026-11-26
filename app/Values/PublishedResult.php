<?php

declare(strict_types=1);

namespace App\Values;

use App\Processes\Enums\AssessmentOutcome;
use Carbon\CarbonImmutable;

/**
 * A current result receipt as another domain reads it: the receipt and run ids, the part's operation, its outcome and
 * when it was published.
 */
final readonly class PublishedResult
{
    public function __construct(
        public string $receiptId,
        public string $runId,
        public string $operation,
        public AssessmentOutcome $outcome,
        public CarbonImmutable $publishedAt,
    ) {}
}
