<?php

declare(strict_types=1);

namespace App\Core\Actors\Exceptions;

use RuntimeException;

/**
 * No middleware authenticated an actor for this request, so nothing may be read or changed on its behalf.
 */
final class ActorContextMissing extends RuntimeException
{
    public static function forRequest(): self
    {
        return new self('This request has no authenticated actor; sign in again or send a signed agent call.');
    }
}
