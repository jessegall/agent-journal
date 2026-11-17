<?php

declare(strict_types=1);

namespace App\Core\Actors\Exceptions;

use RuntimeException;

final class AgentActorRequired extends RuntimeException
{
    public static function forActor(string $kind): self
    {
        return new self("Only an agent may do this; the actor of this request is a {$kind}.");
    }
}
