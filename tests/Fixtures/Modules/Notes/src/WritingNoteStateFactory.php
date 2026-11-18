<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use App\Hooks\Contracts\StateLoader;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
use App\Hooks\States\AgentState;

/**
 * The state of a module installed outside the domain folder: while the agent writes a note, it may not stop.
 */
final class WritingNoteStateFactory implements StateLoader
{
    public function statesFor(StateReferences $references): StateSet
    {
        return StateSet::build($references, fn (StateReference $reference): AgentState => $this->stateFor($reference));
    }

    private function stateFor(StateReference $reference): AgentState
    {
        return new WritingNoteState;
    }

    public function schemaVersion(): int
    {
        return 1;
    }
}
