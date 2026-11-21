<?php

declare(strict_types=1);

namespace App\Hooks\Stack;

use App\Agents\Values\StackTarget;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\StateLoading\Contracts\RecipientStateLoader;
use App\Hooks\StateLoading\Contracts\StackStates;
use App\Hooks\StateLoading\Contracts\StateLoader;
use App\Hooks\StateLoading\StateSet;

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
