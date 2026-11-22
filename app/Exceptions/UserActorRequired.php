<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use RuntimeException;

final class UserActorRequired extends RuntimeException implements CommandRefusal
{
    public static function forActor(string $type): self
    {
        return new self("Only a user may do this; the actor of this request is an {$type}.");
    }
}
