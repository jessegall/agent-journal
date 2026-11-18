<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Agents\Support\StackTarget;
use App\Hooks\Actions\AgentStacks;
use App\Hooks\Decisions\StateReference;
use Illuminate\Container\Attributes\Bind;

/**
 * Pushes a state onto the calling agent's own stack, inside the caller's StackTransactionRunner, under the stack's row lock.
 */
#[Bind(AgentStacks::class)]
interface AgentStack
{
    public function push(StackTarget $target, StateReference $state): void;
}
