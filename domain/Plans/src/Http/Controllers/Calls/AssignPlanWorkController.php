<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Calls;

use App\Assignments\Contracts\AssigneeResolver;
use App\Bus\Contracts\CommandBus;
use Domain\Plans\Calls\AssignPlanWorkCall;
use Domain\Plans\Commands\AssignPlanWork;
use Domain\Plans\Http\Data\PlanWorkResultData;

/**
 * Assigns the work under a plan or phase and answers what changed.
 */
final readonly class AssignPlanWorkController
{
    public function __invoke(
        AssignPlanWorkCall $call,
        CommandBus $commands,
        AssigneeResolver $assignees,
    ): PlanWorkResultData {
        $root = $call->rootRecord();
        $result = $commands->run(new AssignPlanWork($root, $call->recipient()));

        return PlanWorkResultData::of($root, $result, $assignees->holdersOf($result->currentAssignments()));
    }
}
