<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Events\Plans\States;

use App\Stacks\AgentState;
use Tests\Fixtures\Boundary\Events\Tasks\Events\TaskClosed as Closed;

final class PlanState extends AgentState
{
    public function onTaskClosed(Closed $event): void {}
}
