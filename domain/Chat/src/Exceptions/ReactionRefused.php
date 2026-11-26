<?php

declare(strict_types=1);

namespace Domain\Chat\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A reaction that is not exactly one emoji.
 */
final class ReactionRefused extends RuntimeException implements CommandRefusal
{
    public static function notOneEmoji(): self
    {
        return new self('A reaction is exactly one emoji.');
    }
}
