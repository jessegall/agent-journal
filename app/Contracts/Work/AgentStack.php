<?php

declare(strict_types=1);

namespace App\Contracts\Work;

use App\Exceptions\FrameNotHeld;
use App\Support\References\Exceptions\ActivationDeclined;
use App\Support\References\StateReference;
use App\Values\StackTarget;

/**
 * Pushes a state onto the calling agent's own stack, inside the caller's StackTransactionRunner, under the stack's row
 * lock.
 */
interface AgentStack
{
    /**
     * Puts the state on top of the agent's stack for the target.
     */
    public function push(StackTarget $target, StateReference $state): void;

    /**
     * Pushes a state the caller requires: afterwards the stack holds it as live work for its own agent, the state
     * already there included, or the activation is refused and rolls back.
     *
     * @throws ActivationDeclined
     */
    public function activate(StackTarget $target, StateReference $state): void;

    /**
     * Brings the live frame of the state back on top of the agent's stack for the target, with its own values.
     *
     * @throws FrameNotHeld when the stack holds no live frame for the state
     */
    public function lift(StackTarget $target, StateReference $state): void;
}
