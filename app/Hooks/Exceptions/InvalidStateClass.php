<?php

declare(strict_types=1);

namespace App\Hooks\Exceptions;

use App\Hooks\States\AgentState;
use LogicException;

final class InvalidStateClass extends LogicException
{
    public static function for(string $class): self
    {
        return new self($class.' must be a concrete subclass of '.AgentState::class.'.');
    }
}
