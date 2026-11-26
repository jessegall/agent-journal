<?php

declare(strict_types=1);

namespace Domain\Chat\Exceptions;

use LogicException;

/**
 * A dock card or one of its parts was built against the card language's rules.
 */
final class DockCardInvalid extends LogicException
{
    public static function blankKey(string $type): self
    {
        return new self("A {$type} part has no key.");
    }

    public static function repeatedKey(string $key): self
    {
        return new self("Two sibling parts share the key {$key}.");
    }

    public static function emptyDisclosure(string $key): self
    {
        return new self("The disclosure {$key} has nothing to show.");
    }

    public static function progressOutOfRange(string $key, int $completed, int $total): self
    {
        return new self("The progress {$key} counts {$completed} of {$total}.");
    }

    public static function finishedBeforeStart(string $key): self
    {
        return new self("The duration {$key} finishes before it starts.");
    }

    public static function tooMuchText(string $key, int $limit): self
    {
        return new self("The part {$key} holds more than {$limit} characters or lines.");
    }

    public static function blankName(): self
    {
        return new self('A dock card has no accessible name.');
    }
}
