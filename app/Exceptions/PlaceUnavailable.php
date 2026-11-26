<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Files\Enums\Place;
use RuntimeException;

/**
 * A place whose root folder is not configured or does not exist, found when the place is first used.
 */
final class PlaceUnavailable extends RuntimeException
{
    public static function for(Place $place): self
    {
        return new self(
            "The place {$place->value} has no root folder: set {$place->rootSetting()} to a folder that exists.",
        );
    }
}
