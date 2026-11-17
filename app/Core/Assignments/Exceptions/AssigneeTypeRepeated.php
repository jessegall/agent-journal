<?php

declare(strict_types=1);

namespace App\Core\Assignments\Exceptions;

use App\Core\Actors\Enums\ActorType;
use LogicException;

final class AssigneeTypeRepeated extends LogicException
{
    public static function for(ActorType $type): self
    {
        return new self("The actor type {$type->value} is declared able to hold records twice; one owner answers for it.");
    }
}
