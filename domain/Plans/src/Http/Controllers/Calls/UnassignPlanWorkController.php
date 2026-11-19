<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Calls;

use App\Assignments\Contracts\AssigneeResolver;
use App\Bus\Contracts\CommandBus;
use Domain\Plans\Calls\UnassignPlanWorkCall;
use Domain\Plans\Commands\UnassignPlanWork;
use Domain\Plans\Http\Data\PlanWorkResultData;

/**
 * Unassigns the work under a plan or phase and answers what changed.
 */
final readonly class UnassignPlanWorkController
{
    public function __invoke(
        UnassignPlanWorkCall $call,
        CommandBus $commands,
        AssigneeResolver $assignees,
    ): PlanWorkResultData {
        $root = $call->rootRecord();
        $result = $commands->run(new UnassignPlanWork($root, $call->expected()));

        return PlanWorkResultData::of($root, $result, $assignees->holdersOf($result->currentAssignments()));
    }
}
