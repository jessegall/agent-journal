<?php

declare(strict_types=1);

namespace App\Files\Exceptions;

use App\Files\Enums\Place;
use RuntimeException;

/**
 * A path the file funnel never enters: a closed folder inside a place, or a private place reached from outside it.
 */
final class FolderClosed extends RuntimeException
{
    public static function at(string $folder): self
    {
        return new self("The folder {$folder} is closed: no read, list or write enters it.");
    }

    public static function privatePlace(Place $place): self
    {
        return new self("The path lies in the private place {$place->value}, which only its owner names.");
    }
}
