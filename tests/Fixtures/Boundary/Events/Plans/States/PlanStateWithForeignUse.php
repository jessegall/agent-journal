<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Events\Plans\States;

use App\Hooks\States\AgentState;
use App\Hooks\Values\EventCommands;
use Tests\Fixtures\Boundary\Events\Tasks\Events\TaskClosed;

final class PlanStateWithForeignUse extends AgentState
{
    public function onTaskClosed(TaskClosed $event): EventCommands
    {
        event($event);

        return EventCommands::none();
    }

    public function eventClass(): string
    {
        return TaskClosed::class;
    }
}
