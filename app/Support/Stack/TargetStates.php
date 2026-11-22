<?php

declare(strict_types=1);

namespace App\Support\Stack;

use App\Support\Decisions\StateReferences;
use App\Support\StateLoading\Contracts\RecipientStateLoader;
use App\Support\StateLoading\Contracts\StackStates;
use App\Support\StateLoading\Contracts\StateLoader;
use App\Support\StateLoading\StateSet;
use App\Values\StackTarget;

/**
 * The one way states are read for a stack: a batch of one type's references, for the stack they belong to. A loader
 * that depends on the recipient reads for the stack's own actor, never for whoever addressed the stack.
 */
final readonly class TargetStates implements StackStates
{
    public function of(StateLoader $type, StateReferences $references, StackTarget $target): StateSet
    {
        if ($type instanceof RecipientStateLoader) {
            return $type->statesForRecipient($references, $target->actorIdentity());
        }

        return $type->statesFor($references);
    }
}
