<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\WorkStates;

use App\Support\Decisions\Decision;
use App\Support\Inputs\FileEditRequested;
use App\Support\States\AgentState;
use Tests\Support\TestText;

/**
 * A passive state that only gates file edits, which names no work record and owes no instruction.
 */
final class GatesToolsOnly extends AgentState
{
    public function onFileEdit(FileEditRequested $input): Decision
    {
        return Decision::deny(TestText::of('Edits wait.'));
    }
}
