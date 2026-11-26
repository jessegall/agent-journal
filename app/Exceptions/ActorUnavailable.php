<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Exceptions\Concerns\ThrowsLater;
use App\Support\ActorReference;
use RuntimeException;

/**
 * An actor that cannot be reached: missing, retired or not allowed, which all read the same.
 */
final class ActorUnavailable extends RuntimeException implements CommandRefusal
{
    /**
     * @use ThrowsLater<ActorUnavailable>
     */
    use ThrowsLater;

    public static function forIdentity(ActorReference $identity): self
    {
        return new self("{$identity->type} {$identity->id} is not available.");
    }
}
