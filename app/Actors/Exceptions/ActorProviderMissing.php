<?php

declare(strict_types=1);

namespace App\Actors\Exceptions;

use LogicException;

/**
 * An actor type asked for a provider of a kind nobody registered for it.
 */
final class ActorProviderMissing extends LogicException
{
    public static function forType(string $type): self
    {
        return new self("Actors of type {$type} have no provider of this kind; register one at boot.");
    }
}
