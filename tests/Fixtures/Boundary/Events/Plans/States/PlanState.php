<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Events\Plans\States;

use App\Hooks\Attributes\StackWide;
use App\Hooks\States\AgentState;
use App\Hooks\Values\EventCommands;
use Tests\Fixtures\Boundary\Events\Tasks\Events\TaskClosed as Closed;

final class PlanState extends AgentState
{
    #[StackWide]
    public function onTaskClosed(Closed $event): EventCommands
    {
        return EventCommands::none();
    }
}
