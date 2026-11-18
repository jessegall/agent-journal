<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Lifecycle;

use App\Hooks\Contracts\StateLoader;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
use App\Hooks\States\AgentState;
use Tests\Fixtures\Hooks\ScriptedState;

/**
 * A stateless state type a fixture domain registers through its own listener.
 */
final class NoteStateLoader implements StateLoader
{
    public function statesFor(StateReferences $references): StateSet
    {
        return StateSet::build($references, fn (StateReference $reference): AgentState => $this->stateFor($reference));
    }

    private function stateFor(StateReference $reference): AgentState
    {
        return ScriptedState::delegating();
    }

    public function schemaVersion(): int
    {
        return 1;
    }
}
