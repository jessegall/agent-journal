<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Ticks;

use App\Hooks\Contracts\TickableState;
use App\Hooks\States\AgentState;
use App\Hooks\Ticks\TickCommands;
use App\Hooks\Ticks\TickContext;

/**
 * A fixture state that ticks and asks for nothing; a test says whether its work is done.
 */
final class TickingState extends AgentState implements TickableState
{
    public function __construct(private readonly bool $finished) {}

    public function isFinished(): bool
    {
        return $this->finished;
    }

    public function onTick(TickContext $tick): TickCommands
    {
        return TickCommands::none();
    }
}
