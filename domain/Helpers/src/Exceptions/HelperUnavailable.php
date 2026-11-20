<?php

declare(strict_types=1);

namespace Domain\Helpers\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A helper the caller may not dispatch: another parent's, a missing one, or any helper when the caller may not
 * delegate or would hand on more than it holds. Every case answers alike, so nothing about the helper leaks.
 */
final class HelperUnavailable extends RuntimeException implements CommandRefusal
{
    public static function toYou(): self
    {
        return new self('This helper is unavailable to you. Choose a helper you may dispatch.');
    }
}
