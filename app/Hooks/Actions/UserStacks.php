<?php

declare(strict_types=1);

namespace App\Hooks\Actions;

use App\Actors\Contracts\CurrentActor;
use App\Agents\Support\StackTarget;
use App\Hooks\Contracts\UserStack;
use App\Hooks\Decisions\StateReference;

/**
 * Pushes a state onto a running agent's stack for the user acting in this request, such as a message they want
 * answered. The agent stays the target: its own role restores the stack, its frames stay, and the change runs in the
 * caller's stack transaction under the stack's row lock. An agent never reaches another agent's stack this way.
 */
final readonly class UserStacks implements UserStack
{
    public function __construct(
        private CurrentActor $actors,
        private AddressedStackPush $addressed,
    ) {}

    public function push(StackTarget $target, StateReference $state): void
    {
        $this->actors->actor()->requireUser();
        $this->addressed->push($target, $state);
    }
}
