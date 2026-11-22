<?php

declare(strict_types=1);

namespace App\Support\StateLoading\Contracts;

use App\Support\Decisions\StateReferences;
use App\Support\StateLoading\StateSet;
use App\Values\StackTarget;

/**
 * Reads one type's states for the stack they belong to, so a loader that depends on the recipient reads for the
 * stack's own actor.
 */
interface StackStates
{
    public function of(StateLoader $type, StateReferences $references, StackTarget $target): StateSet;
}
