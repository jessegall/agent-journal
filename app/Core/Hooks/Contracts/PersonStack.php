<?php

declare(strict_types=1);

namespace App\Core\Hooks\Contracts;

use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\PersonStacks;
use App\Core\Hooks\StackTarget;
use Illuminate\Container\Attributes\Bind;

/**
 * Pushes a state onto a running agent's stack for the person acting in this request, inside the caller's StackWork.
 * Only a person may; the agent stays the target and its own role restores the stack.
 */
#[Bind(PersonStacks::class)]
interface PersonStack
{
    public function push(StackTarget $target, StateReference $state): void;
}
