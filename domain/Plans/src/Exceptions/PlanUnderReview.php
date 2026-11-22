<?php

declare(strict_types=1);

namespace Domain\Plans\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A plan under review, its phases and its tasks hold still until the review is decided or withdrawn.
 */
final class PlanUnderReview extends RuntimeException implements CommandRefusal
{
    public static function forPlan(int $number): self
    {
        return new self(
            "Plan {$number} is under review, so it can't change now. Withdraw the review or wait for its decision.",
        );
    }
}
