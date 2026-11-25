<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Contracts\Bus\CommandRefusal;
use App\Support\ActorIdentity;
use RuntimeException;

/**
 * An actor without the capability to send messages tried to send one.
 */
final class ActorCannotSend extends RuntimeException implements CommandRefusal
{
    public static function forIdentity(ActorIdentity $identity): self
    {
        return new self("{$identity->type} {$identity->id} cannot send messages.");
    }
}
