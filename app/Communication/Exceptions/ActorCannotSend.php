<?php

declare(strict_types=1);

namespace App\Communication\Exceptions;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * An actor without the capability to send messages tried to send one.
 */
final class ActorCannotSend extends RuntimeException implements CommandRefusal
{
    public static function forIdentity(ActorIdentity $identity): self
    {
        return new self("{$identity->type->value} {$identity->id} cannot send messages.");
    }
}
