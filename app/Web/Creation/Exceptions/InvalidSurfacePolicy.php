<?php

declare(strict_types=1);

namespace App\Web\Creation\Exceptions;

use LogicException;

final class InvalidSurfacePolicy extends LogicException
{
    public static function at(string $location, string $reason): self
    {
        return new self("{$location}: {$reason}");
    }
}
