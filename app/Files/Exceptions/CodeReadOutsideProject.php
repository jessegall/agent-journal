<?php

declare(strict_types=1);

namespace App\Files\Exceptions;

use App\Files\Enums\Place;
use LogicException;

/**
 * A code read of a place other than the project: only the project's own code is kept for the life of a process.
 */
final class CodeReadOutsideProject extends LogicException
{
    public static function for(Place $place): self
    {
        return new self("Code is read from the project only, never from the place {$place->value}; read it as data.");
    }
}
