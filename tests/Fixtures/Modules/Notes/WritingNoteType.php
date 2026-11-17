<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use App\Core\Hooks\Decisions\StateReference;
use App\Core\Hooks\States\AgentState;
use App\Core\Hooks\Contracts\StateType;

/**
 * The state of a module installed outside app/Domain: while the agent writes a note, it may not stop.
 */
final class WritingNoteType implements StateType
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
