<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Events\Plans\States;

use App\Stacks\AgentState;
use Tests\Fixtures\Boundary\Events\Tasks\Events\TaskClosed;

final class PlanStateWithForeignUse extends AgentState
{
    public function onTaskClosed(TaskClosed $event): void
    {
        event($event);
    }

    public function eventClass(): string
    {
        return TaskClosed::class;
    }
}
