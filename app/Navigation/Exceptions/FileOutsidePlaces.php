<?php

declare(strict_types=1);

namespace App\Navigation\Exceptions;

use App\Files\Enums\Place;
use InvalidArgumentException;

/**
 * An absolute path given from outside, such as a command's --file, that lies in none of the open places.
 */
final class FileOutsidePlaces extends InvalidArgumentException
{
    public static function given(): self
    {
        $places = implode(', ', array_map(fn (Place $place) => $place->value, Place::notPrivate()));

        return new self("The file lies outside every place a path may name; name a file in one of these: {$places}.");
    }
}
