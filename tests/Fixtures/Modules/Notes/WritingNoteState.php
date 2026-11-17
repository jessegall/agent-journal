<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Notes;

use App\Core\Hooks\Decisions\Decision;
use App\Core\Hooks\Inputs\StopRequested;
use App\Core\Hooks\States\AgentState;

/**
 * While the agent writes a note, it may not stop.
 */
final class WritingNoteState extends AgentState
{
    public function onStop(StopRequested $input): Decision
    {
        return Decision::deny('Finish the note first.');
    }
}
