<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Calls;

use App\Contracts\Assignments\AssigneeResolver;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Records\RecordResolver;
use Domain\Plans\Calls\ReassignPlanWorkCall;
use Domain\Plans\Commands\ReassignPlanWork\ReassignPlanWorkCommand;
use Domain\Plans\Data\PlanWorkResultData;

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
        $assignmentResult = $commands->run(new ReassignPlanWorkCommand($root, $call->expected(), $call->recipient()));

        return PlanWorkResultData::of(
            $root,
            $assignmentResult,
            $assignees->holdersOf($assignmentResult->currentAssignments()),
        );
    }
}
