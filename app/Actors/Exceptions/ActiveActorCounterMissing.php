<?php

declare(strict_types=1);

namespace App\Actors\Exceptions;

use LogicException;

final class ActiveActorCounterMissing extends LogicException
{
    public static function for(string $type): self
    {
        return new self("No counter of present {$type} actors is registered.");
    }
}
