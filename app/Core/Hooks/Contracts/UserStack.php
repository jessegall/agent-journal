<?php

declare(strict_types=1);

namespace App\Core\Hooks\Contracts;

use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\StackTarget;
use App\Core\Hooks\UserStacks;
use Illuminate\Container\Attributes\Bind;

/**
 * Pushes a state onto a running agent's stack for the user acting in this request, inside the caller's StackTransactionRunner.
 * Only a user may; the agent stays the target and its own role restores the stack.
 */
#[Bind(UserStacks::class)]
interface UserStack
{
    public function push(StackTarget $target, StateReference $state): void;
}
