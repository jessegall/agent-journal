<?php

declare(strict_types=1);

namespace App\Hooks\References\Exceptions;

use App\Agents\Values\StackTarget;
use App\Hooks\References\StateReference;
use LogicException;

/**
 * An explicit activation that left its state without live work on the stack: a switched-off type, a run the
 * recipient no longer holds, or work already over. Thrown so the activation's transaction rolls back.
 */
final class ActivationDeclined extends LogicException
{
    public static function for(StateReference $state, StackTarget $target): self
    {
        $stack = $target->description();

        return new self("The {$state->typeKey} state did not become live work on the stack of {$stack}.");
    }
}
