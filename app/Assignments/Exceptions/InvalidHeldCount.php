<?php

declare(strict_types=1);

namespace App\Assignments\Exceptions;

use LogicException;

final class InvalidHeldCount extends LogicException
{
    public static function negative(int $held): self
    {
        return new self("The held-work count was {$held}; it must be zero or more.");
    }
}
