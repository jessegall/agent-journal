<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Lifecycle;

use App\Domain\Hooks\Decisions\StateReference;
use App\Domain\Hooks\States\AgentState;
use App\Domain\Hooks\States\StateType;
use Tests\Fixtures\Hooks\ScriptedState;

/**
 * A stateless state type a fixture domain registers through its own listener.
 */
final class NoteStateType implements StateType
{
    public function stateFor(StateReference $reference): AgentState
    {
        return ScriptedState::delegating();
    }

    public function schemaVersion(): int
    {
        return 1;
    }
}
