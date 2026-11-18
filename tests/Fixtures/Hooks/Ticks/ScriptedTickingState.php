<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Ticks;

use App\Hooks\Contracts\TickableState;
use App\Hooks\States\AgentState;
use App\Hooks\Ticks\TickCommands;
use App\Hooks\Ticks\TickContext;

/**
 * A ticking state that hands its tick to its loader's script.
 */
final class ScriptedTickingState extends AgentState implements TickableState
{
    public function __construct(
        private readonly string $subject,
        private readonly ScriptedTickingLoader $loader,
    ) {}

    public function onTick(TickContext $tick): TickCommands
    {
        return $this->loader->tick($this->subject, $tick);
    }
}
