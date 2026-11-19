<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Agents\Support\StackTarget;
use App\Hooks\Decisions\StateReference;

/**
 * Pushes a state onto the calling agent's own stack, inside the caller's StackTransactionRunner, under the stack's row
 * lock.
 */
interface AgentStack
{
    public function push(StackTarget $target, StateReference $state): void;
}
