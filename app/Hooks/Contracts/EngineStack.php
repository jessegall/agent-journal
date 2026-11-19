<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Agents\Support\StackTarget;
use App\Hooks\Actions\EngineStacks;
use App\Hooks\Decisions\StateReference;
use Illuminate\Container\Attributes\Bind;

/**
 * Pushes a state onto the stack the engine's grant names. Only a handler already running in a bus transaction uses it,
 * never a state's onTick: the push is admitted, locked and settled exactly like any other push.
 */
#[Bind(EngineStacks::class)]
interface EngineStack
{
    public function push(StackTarget $target, StateReference $reference): void;

    /**
     * Pops the finished and switched-off frames exposed at the top of the granted target's stack, with their exits.
     */
    public function popExposed(StackTarget $target): void;
}
