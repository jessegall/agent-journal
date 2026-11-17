<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use App\Core\Hooks\Decisions\Decision;
use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\States\AgentState;
use App\Core\Hooks\Contracts\StateType;
use Tests\Fixtures\Hooks\ScriptedState;

/**
 * The state of a module installed outside app/Domain: while the agent writes a note, it may not stop.
 */
final class WritingNoteType implements StateType
{
    public function stateFor(StateReference $reference): AgentState
    {
        return new ScriptedState(Decision::preventStop('Finish the note first.'));
    }

    public function schemaVersion(): int
    {
        return 1;
    }
}
