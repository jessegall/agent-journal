<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\HookStates\Tasks\States;

use Tests\Fixtures\Boundary\HookStates\Hooks\Inputs\StopRequested;

final class WorkingOnTask
{
    public function onStop(StopRequested $input): string
    {
        return "Task held for session {$input->sessionId}.";
    }
}
