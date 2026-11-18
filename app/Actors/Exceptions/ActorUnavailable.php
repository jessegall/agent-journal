<?php

declare(strict_types=1);

namespace App\Actors\Exceptions;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * An actor that cannot be reached: missing, retired or not allowed, which all read the same.
 */
final class ActorUnavailable extends RuntimeException implements CommandRefusal
{
    public static function forIdentity(ActorIdentity $identity): self
    {
        return new self("{$identity->type->value} {$identity->id} is not available.");
    }
}
