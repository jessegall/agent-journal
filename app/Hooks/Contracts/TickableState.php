<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Hooks\Ticks\TickCommands;
use App\Hooks\Ticks\TickContext;

/**
 * A state the engine ticks: it reads only its own snapshot and the context, and answers the commands to run, in order.
 */
interface TickableState
{
    public function onTick(TickContext $tick): TickCommands;
}
