<?php

declare(strict_types=1);

namespace App\Events\Reviews;

use App\Contracts\Work\CodeReviewEvent;

/**
 * A code review opened on an imported piece of work, with the ask that holds it.
 */
final readonly class CodeReviewOpened extends ReviewEvent implements CodeReviewEvent
{
    public function __construct(
        public string $reviewId,
        public string $askId,
    ) {}
}
