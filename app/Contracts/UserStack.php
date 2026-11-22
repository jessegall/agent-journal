<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\References\StateReference;
use App\Values\StackTarget;

/**
 * Pushes a state onto a running agent's stack for the user acting in this request, inside the caller's
 * StackTransactionRunner.
 * Only a user may; the agent stays the target and its own profile decides at each hook.
 */
interface UserStack
{
    public function push(StackTarget $target, StateReference $state): void;
}
