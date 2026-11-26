<?php

declare(strict_types=1);

namespace App\Actors\Exceptions;

use LogicException;

/**
 * A second provider registered for an actor type that already has one.
 */
final class ActorProviderRepeated extends LogicException
{
    public static function forType(string $type): self
    {
        return new self("Actors of type {$type} already have a provider.");
    }
}
