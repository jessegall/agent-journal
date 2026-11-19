<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Calls;

use App\Assignments\Contracts\AssigneeResolver;
use App\Bus\Contracts\CommandBus;
use Domain\Plans\Calls\ReassignPlanWorkCall;
use Domain\Plans\Commands\ReassignPlanWork;
use Domain\Plans\Http\Data\PlanWorkResultData;

/**
 * Reassigns the work under a plan or phase and answers what changed.
 */
final readonly class ReassignPlanWorkController
{
    public function __invoke(
        ReassignPlanWorkCall $call,
        CommandBus $commands,
        AssigneeResolver $assignees,
    ): PlanWorkResultData {
        $root = $call->rootRecord();
        $result = $commands->run(new ReassignPlanWork($root, $call->expected(), $call->recipient()));

        return PlanWorkResultData::of($root, $result, $assignees->holdersOf($result->currentAssignments()));
    }
}
