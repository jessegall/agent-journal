<?php

declare(strict_types=1);

namespace App\Actors\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use RuntimeException;

final class CrossOwnerReadRefused extends RuntimeException implements CommandRefusal
{
    public static function forActor(string $type): self
    {
        return new self("This read covers every owner's rows, which the {$type} acting in this request may not read.");
    }
}
