<?php

declare(strict_types=1);

namespace App\Hooks\StateLoading\Contracts;

use App\Agents\Values\StackTarget;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\StateLoading\StateSet;
use App\Hooks\StateLoading\Contracts\StateLoader;

/**
 * Reads one type's states for the stack they belong to, so a loader that depends on the recipient reads for the
 * stack's own actor.
 */
interface StackStates
{
    public function of(StateLoader $type, StateReferences $references, StackTarget $target): StateSet;
}
