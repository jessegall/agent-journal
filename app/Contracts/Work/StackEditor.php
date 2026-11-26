<?php

declare(strict_types=1);

namespace App\Contracts\Work;

use App\Stacks\References\StateReference;

/**
 * The stack as one answering state may change it: remove itself, or put a new state over itself.
 */
interface StackEditor
{
    /**
     * Takes the state that answers the current hook off the stack.
     */
    public function popAnswerState(): void;

    /**
     * Puts the state on the stack above the state that answers the current hook.
     */
    public function pushOverAnswerState(StateReference $state): void;
}
