<?php

declare(strict_types=1);

namespace App\Events\Reviews;

use App\Contracts\Work\CodeReviewEvent;
use App\Enums\Reviews\CodeReviewState;

/**
 * A code review was settled in the state given.
 */
final readonly class CodeReviewSettled extends ReviewEvent implements CodeReviewEvent
{
    public function __construct(
        public string $reviewId,
        public CodeReviewState $state,
    ) {}
}
