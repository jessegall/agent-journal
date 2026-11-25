<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

/**
 * A review decision on an ask that holds no open code review.
 */
final class CodeReviewRefused extends RuntimeException implements CommandRefusal
{
    /** @use ThrowsLater<CodeReviewRefused> */
    use ThrowsLater;

    public static function notOpen(string $askId): self
    {
        return new self("Ask {$askId} holds no open code review, so it takes no review decision.");
    }
}
