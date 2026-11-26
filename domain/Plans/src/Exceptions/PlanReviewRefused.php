<?php

declare(strict_types=1);

namespace Domain\Plans\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A plan's review cannot change as asked; the message is safe to show to whoever asked.
 */
final class PlanReviewRefused extends RuntimeException implements CommandRefusal
{
    public static function notPlanned(int $number, string $state): self
    {
        return new self("Plan {$number} is {$state}; only a planned plan can be put up for review.");
    }

    public static function alreadyDecided(int $number, int $review, string $state): self
    {
        $outcome = str_replace('_', ' ', $state);

        return new self("Review {$review} of plan {$number} is already {$outcome}.");
    }

    public static function notReviewing(int $number, string $state): self
    {
        return new self("Plan {$number} is {$state}, so it has no review to withdraw.");
    }
}
