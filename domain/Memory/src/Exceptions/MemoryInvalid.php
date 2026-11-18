<?php

declare(strict_types=1);

namespace Domain\Memory\Exceptions;

use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * A memory text or weight the journal does not keep: blank text, a weight outside 1 to 10, or an edit of nothing.
 */
final class MemoryInvalid extends InvalidArgumentException implements CommandRefusal
{
    public static function blankText(): self
    {
        return new self('A memory needs text: write what to do and when.');
    }

    public static function weight(int $weight): self
    {
        return new self("A memory weighs 1 to 10, not {$weight}.");
    }

    public static function nothingToChange(): self
    {
        return new self('Name a new text, a new weight or both.');
    }
}
