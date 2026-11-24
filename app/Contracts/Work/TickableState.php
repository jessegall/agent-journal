<?php

declare(strict_types=1);

namespace App\Contracts\Work;

use App\Support\Ticks\TickCommands;
use App\Support\Ticks\TickContext;

/**
 * A state the engine ticks: it reads only its own snapshot and the context, and answers the commands to run, in order.
 */
interface TickableState
{
    /**
     * Called on every tick of the engine while the state is on a stack; returns the commands it asks for.
     */
    public function onTick(TickContext $tick): TickCommands;
}
