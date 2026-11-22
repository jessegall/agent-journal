<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\CommandRefusal;
use RuntimeException;

final class SystemActorRequired extends RuntimeException implements CommandRefusal
{
    public static function forActor(string $type): self
    {
        return new self("Only the journal itself may do this; the actor of this request is an {$type}.");
    }
}
