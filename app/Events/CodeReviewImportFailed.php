<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Work\CodeReviewEvent;

/**
 * A code review's import of the helper's work failed.
 */
final readonly class CodeReviewImportFailed extends ReviewEvent implements CodeReviewEvent
{
    public function __construct(
        public string $reviewId,
    ) {}
}
