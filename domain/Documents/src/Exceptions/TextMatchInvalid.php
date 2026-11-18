<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * A replacement whose old text is not in the body exactly once.
 */
final class TextMatchInvalid extends InvalidArgumentException implements CommandRefusal
{
    public static function count(int $count): self
    {
        return new self("The text to replace appears {$count} times; it must appear exactly once.");
    }
}
