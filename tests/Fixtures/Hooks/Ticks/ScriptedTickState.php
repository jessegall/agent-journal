<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Ticks;

use App\Contracts\Work\TickableState;
use App\Engine\Ticks\TickContext;
use App\Stacks\AgentState;
use App\Stacks\Attributes\Ticks;
use App\Support\Ticks\TickCommands;

/**
 * A ticking state whose tick answers what the test's script says for its subject.
 */
#[Ticks(guard: ScriptedOccurrenceGuard::class)]
final class ScriptedTickState extends AgentState implements TickableState
{
    public function __construct(private readonly string $subject, private readonly TickScript $script) {}

    public function onTick(TickContext $tick): TickCommands
    {
        return $this->script->tick($this->subject, $tick);
    }
}
