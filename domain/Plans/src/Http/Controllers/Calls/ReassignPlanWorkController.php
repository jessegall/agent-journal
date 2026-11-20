<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Calls;

use App\Assignments\Contracts\AssigneeResolver;
use App\Bus\Contracts\CommandBus;
use App\Records\Contracts\RecordResolver;
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
        RecordResolver $records,
        AssigneeResolver $assignees,
    ): PlanWorkResultData {
        $root = $call->rootRecord($records);
        $assignmentResult = $commands->run(new ReassignPlanWork($root, $call->expected(), $call->recipient()));

        return PlanWorkResultData::of(
            $root,
            $assignmentResult,
            $assignees->holdersOf($assignmentResult->currentAssignments()),
        );
    }
}
