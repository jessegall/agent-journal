<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\WorkStates;

use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\FileEditRequested;
use App\Hooks\States\AgentState;

/**
 * A passive state that only gates file edits, which owes no instruction or lifecycle answer.
 */
final class GatesToolsOnly extends AgentState
{
    public function onFileEdit(FileEditRequested $input): Decision
    {
        return Decision::deny('Edits wait.');
    }
}
