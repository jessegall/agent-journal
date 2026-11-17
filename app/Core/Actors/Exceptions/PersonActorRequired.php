<?php

declare(strict_types=1);

namespace App\Core\Actors\Exceptions;

use RuntimeException;

final class PersonActorRequired extends RuntimeException
{
    public static function forActor(string $kind): self
    {
        return new self("Only a person may do this; the actor of this request is an {$kind}.");
    }
}
