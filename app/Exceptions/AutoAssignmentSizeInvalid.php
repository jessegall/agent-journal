<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use InvalidArgumentException;

final class AutoAssignmentSizeInvalid extends InvalidArgumentException implements CommandRefusal
{
    public static function for(int $size, int $largest): self
    {
        return new self("An auto-assignment keeps 1 to {$largest} items in hand; {$size} is not allowed.");
    }
}
