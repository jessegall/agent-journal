<?php

declare(strict_types=1);

namespace App\Contracts\Actors;

use App\Exceptions\FrameNotHeld;
use App\Support\ActorIdentity;
use App\Support\RecordIdentity;
use App\Support\References\StateReference;
use PhpOption\Option;

/**
 * The stacks the acting actor works on: a domain pushes its work there without asking who acts, and an actor that
 * works on no stack, such as a user, gets nothing pushed.
 */
interface ActorWorkStacks
{
    /**
     * Pushes the state onto the stacks the acting actor works on now.
     */
    public function push(StateReference $state): void;

    /**
     * Pushes onto the stacks another actor works on now, such as the actor a message is addressed to; nothing when it
     * runs no session.
     */
    public function pushFor(ActorIdentity $actor, StateReference $state): void;

    /**
     * Pushes onto one stack of another actor, and only while every stack it works on rests on its bottom state: work
     * offered to an actor that is busy is left for later.
     */
    public function offerFor(ActorIdentity $actor, StateReference $state): void;

    /**
     * Brings the state's live frame back on top of the stacks the acting actor works on now, with its own values.
     *
     * @throws FrameNotHeld when a stack the actor works on holds no live frame for the state
     */
    public function lift(StateReference $state): void;

    /**
     * The live frame of the type on the acting actor's work stack; none for an actor that works on no stack.
     *
     * @return Option<StateReference>
     */
    public function current(string $typeKey): Option;

    /**
     * The record the acting actor works on now, as its top live state names it; none when no state names one.
     *
     * @return Option<RecordIdentity>
     */
    public function currentRecord(): Option;
}
