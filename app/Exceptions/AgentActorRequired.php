<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use RuntimeException;

final class AgentActorRequired extends RuntimeException implements CommandRefusal
{
    public static function forActor(string $type): self
    {
        return new self("Only an agent may do this; the actor of this request is a {$type}.");
    }
}
