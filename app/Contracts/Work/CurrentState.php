<?php

declare(strict_types=1);

namespace App\Contracts\Work;

use App\Support\Decisions\StateReferenceFactory;
use App\Support\RecordIdentity;
use App\Support\References\StateReference;
use App\Values\StackTarget;
use PhpOption\Option;

/**
 * Which state of a type a stack is working in now: the highest frame of that type whose work is not done, covered or
 * not. A domain asks for its own type key, so its current task or plan is read from the stack, never stored.
 */
interface CurrentState
{
    /**
     * @return Option<StateReference> none when the stack is closed or holds no live frame of the type
     */
    public function of(StackTarget $target, string $typeKey): Option;

    /**
     * The live frame of the reference class's type on the acting actor's first stack.
     *
     * @param  class-string<StateReferenceFactory>  $reference
     * @return Option<StateReference> none for an actor that runs no session, or a stack without such a frame
     */
    public function ofCaller(string $reference): Option;

    /**
     * The state the stack answers from now: its highest frame whose work is not done.
     *
     * @return Option<StateReference> none when the stack is closed or holds no live frame
     */
    public function top(StackTarget $target): Option;

    /**
     * @return Option<RecordIdentity>
     */
    public function record(StackTarget $target): Option;
}
