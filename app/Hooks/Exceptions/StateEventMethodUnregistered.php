<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use App\Hooks\Declarations\StateMethod;
use LogicException;

final class StateEventMethodUnregistered extends LogicException
{
    public static function for(string $event, StateMethod $method): self
    {
        return new self("{$method->stateClass}::{$method->name} is not registered for {$event}.");
    }
}
