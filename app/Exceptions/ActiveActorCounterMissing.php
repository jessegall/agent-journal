<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Enums\ActorType;
use LogicException;

final class ActiveActorCounterMissing extends LogicException
{
    public static function for(ActorType $type): self
    {
        return new self("No counter of present {$type->value} actors is registered.");
    }
}
