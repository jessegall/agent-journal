<?php

declare(strict_types=1);

namespace App\Stacks\Contracts\Work;

use App\Stacks\Exceptions\FrameNotHeld;
use App\Stacks\References\Exceptions\ActivationDeclined;
use App\Stacks\References\StateReference;
use App\Support\ActorReference;
use App\Values\StackTarget;

/**
 * Pushes a state onto the calling agent's own stack, inside the caller's StackTransactionRunner, under the stack's row
 * lock.
 */
interface AgentStacks
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

    /**
     * Pushes a state the caller requires onto each stack the acting actor works in now, as activate does; an actor
     * that runs no session gets nothing.
     *
     * @throws ActivationDeclined
     */
    public function activateForCaller(StateReference $state): void;

    /**
     * Brings the state's live frame back on top of each stack the acting actor works in now, as lift does.
     *
     * @throws FrameNotHeld when such a stack holds no live frame for the state
     */
    public function liftForCaller(StateReference $state): void;

    /**
     * Pushes onto the stacks of another actor's running sessions, such as the actor a message is addressed to;
     * nothing when it runs no session.
     */
    public function pushFor(ActorReference $actor, StateReference $state): void;

    /**
     * Pushes onto the stack of one running session of another actor, such as the session a model change is for.
     */
    public function pushForSession(StackTarget $target, StateReference $state): void;

    /**
     * Pushes onto one stack of another actor, and only while every stack it works in rests on its bottom state: work
     * offered to an actor that is busy is left for later.
     */
    public function offerFor(ActorReference $actor, StateReference $state): void;
}
