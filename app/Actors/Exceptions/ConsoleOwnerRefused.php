<?php

declare(strict_types=1);

namespace App\Actors\Exceptions;

use App\Actors\Contracts\Actor;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * The journal's access policy no longer admits the configured owner, so no owner command runs from the command line.
 */
final class ConsoleOwnerRefused extends RuntimeException implements CommandRefusal
{
    public static function forActor(Actor $actor): self
    {
        $actorText = "{$actor->actorType()->value} {$actor->actorId()}";

        return new self("The access policy does not admit {$actorText} as the owner.");
    }
}
