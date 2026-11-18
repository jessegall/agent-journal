<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use App\Hooks\Contracts\StateType;
use App\Hooks\Decisions\StateReference;
use App\Hooks\States\AgentState;

/**
 * The state of a module installed outside the domain folder: while the agent writes a note, it may not stop.
 */
final class WritingNoteStateFactory implements StateType
{
    public function stateFor(StateReference $reference): AgentState
    {
        return new WritingNoteState;
    }

    public function schemaVersion(): int
    {
        return 1;
    }
}
