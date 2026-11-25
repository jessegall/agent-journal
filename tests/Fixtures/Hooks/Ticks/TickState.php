<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Ticks;

use App\Attributes\States\Ticks;
use App\Contracts\Work\TickableState;
use App\Support\States\AgentState;
use App\Support\Ticks\TickCommands;
use App\Support\Ticks\TickContext;
use Tests\Fixtures\Hooks\Stacks\FinishedSubjects;

/**
 * A ticking state about one subject that asks for nothing, finished once the test has finished that subject.
 */
#[Ticks(guard: ScriptedOccurrenceGuard::class)]
final class TickState extends AgentState implements TickableState
{
    public function __construct(private readonly string $subject, private readonly FinishedSubjects $hasFinished) {}

    public function isFinished(): bool
    {
        return $this->hasFinished->has($this->subject);
    }

    public function onTick(TickContext $tick): TickCommands
    {
        return TickCommands::none();
    }
}
