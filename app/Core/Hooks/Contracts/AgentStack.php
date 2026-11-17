<?php

declare(strict_types=1);

namespace App\Core\Hooks\Contracts;

use App\Core\Hooks\AgentStacks;
use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\StackTarget;
use Illuminate\Container\Attributes\Bind;

/**
 * Pushes a state onto the calling agent's own stack, inside the caller's StackTransactionRunner, under the stack's row lock.
 */
#[Bind(AgentStacks::class)]
interface AgentStack
{
    public function push(StackTarget $target, StateReference $state): void;
}
