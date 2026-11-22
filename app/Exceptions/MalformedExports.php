<?php

declare(strict_types=1);

namespace App\Exceptions;

use InvalidArgumentException;

/**
 * An export declaration whose shape is wrong before any class is looked at: an empty name, a keyed list or a name
 * listed twice.
 */
final class MalformedExports extends InvalidArgumentException
{
    public static function emptyName(string $group, int $position): self
    {
        return new self(
            "The {$group} exports hold an empty name at position {$position};"
            .' name the class or remove the entry.',
        );
    }

    public static function keyedList(string $group): self
    {
        return new self("The {$group} exports are keyed; pass the class names as a plain list.");
    }

    public static function listedTwice(string $name, string $firstList, string $secondList): self
    {
        return new self(
            "{$name} is exported in {$firstList} and again in {$secondList}; export each class in one list, once.",
        );
    }
}
