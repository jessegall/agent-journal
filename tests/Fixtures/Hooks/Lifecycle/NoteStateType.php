<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Lifecycle;

use App\Core\Hooks\Contracts\StateType;
use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\States\AgentState;
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
