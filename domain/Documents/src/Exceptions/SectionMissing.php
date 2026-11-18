<?php

declare(strict_types=1);

namespace Domain\Documents\Exceptions;

use App\Contracts\CommandRefusal;
use InvalidArgumentException;

/**
 * A section that is not in the text, or a heading that names several.
 */
final class SectionMissing extends InvalidArgumentException implements CommandRefusal
{
    public static function number(int $number, int $count): self
    {
        return new self("There is no section {$number}; the text has {$count} sections.");
    }

    public static function named(string $heading): self
    {
        return new self("No section is headed {$heading}.");
    }

    public static function ambiguous(string $heading, int $count): self
    {
        return new self("{$count} sections are headed {$heading}; name the section by its number.");
    }

    public static function levelChanged(int $number): self
    {
        return new self("The new text of section {$number} starts with a heading of another level; keep its level or edit the outline.");
    }
}
