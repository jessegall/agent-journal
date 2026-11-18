<?php

declare(strict_types=1);

namespace App\Actors\Exceptions;

use RuntimeException;

final class EngineActorRequired extends RuntimeException
{
    public static function forActor(string $type): self
    {
        return new self("Only the engine may do this; the actor of this request is a {$type}.");
    }
}
