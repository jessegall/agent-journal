<?php

declare(strict_types=1);

namespace App\Exceptions;

use LogicException;

final class ActiveActorCounterRepeated extends LogicException
{
    public static function for(string $type): self
    {
        return new self("A counter of present {$type} actors is already registered.");
    }
}
