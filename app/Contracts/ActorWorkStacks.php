<?php

declare(strict_types=1);

namespace App\Contracts;

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
    public function push(StateReference $state): void;

    /**
     * Pushes onto the stacks another actor works on now, such as the actor a message is addressed to; nothing when it
     * runs no session.
     */
    public function pushFor(ActorIdentity $actor, StateReference $state): void;

    public function offerFor(ActorIdentity $actor, StateReference $state): void;

    public function pruneCurrent(): void;

    /**
     * The live frame of the type on the acting actor's work stack; none for an actor that works on no stack.
     *
     * @return Option<StateReference>
     */
    public function current(string $typeKey): Option;

    /**
     * @return Option<RecordIdentity>
     */
    public function currentRecord(): Option;
}
