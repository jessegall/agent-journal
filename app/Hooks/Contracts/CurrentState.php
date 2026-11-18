<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Agents\Support\StackTarget;
use App\Hooks\Actions\CurrentStates;
use App\Hooks\Decisions\StateReference;
use Illuminate\Container\Attributes\Bind;
use PhpOption\Option;

/**
 * Which state of a type a stack is working in now: the highest frame of that type whose work is not done, covered or
 * not. A domain asks for its own type key, so its current task or plan is read from the stack, never stored.
 */
#[Bind(CurrentStates::class)]
interface CurrentState
{
    /**
     * @return Option<StateReference> none when the stack is closed or holds no live frame of the type
     */
    public function of(StackTarget $target, string $typeKey): Option;
}
