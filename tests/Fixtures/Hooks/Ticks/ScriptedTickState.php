<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Ticks;

use App\Attributes\Ticks;
use App\Contracts\Work\TickableState;
use App\Support\States\AgentState;
use App\Support\Ticks\TickCommands;
use App\Support\Ticks\TickContext;

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
