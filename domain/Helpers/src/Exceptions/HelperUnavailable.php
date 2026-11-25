<?php

declare(strict_types=1);

namespace Domain\Helpers\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

/**
 * A helper the caller may not dispatch: another parent's, a missing one, or any helper when the caller may not
 * delegate or would hand on more than it holds. Every case answers alike, so nothing about the helper leaks.
 */
final class HelperUnavailable extends RuntimeException implements CommandRefusal
{
    /** @use ThrowsLater<HelperUnavailable> */
    use ThrowsLater;

    public static function forIndependentReview(string $profileKey): self
    {
        return new self(
            "The one {$profileKey} helper already worked on this purpose, so it cannot review it independently. "
            .'Choose an independent profile, or report that no independent review is possible.',
        );
    }

    public static function toYou(): self
    {
        return new self('This helper is unavailable to you. Choose a helper you may dispatch.');
    }
}
