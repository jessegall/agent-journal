<?php

declare(strict_types=1);

namespace App\Actors\Exceptions;

use App\Actors\Enums\ActorType;
use LogicException;

final class ActiveActorCounterRepeated extends LogicException
{
    public static function for(ActorType $type): self
    {
        return new self("A counter of present {$type->value} actors is already registered.");
    }
}
