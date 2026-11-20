<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Calls;

use App\Assignments\Contracts\AssigneeResolver;
use App\Bus\Contracts\CommandBus;
use App\Records\Contracts\RecordResolver;
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
        RecordResolver $records,
        AssigneeResolver $assignees,
    ): PlanWorkResultData {
        $root = $call->rootRecord($records);
        $assignmentResult = $commands->run(new AssignPlanWork($root, $call->recipient()));

        return PlanWorkResultData::of(
            $root,
            $assignmentResult,
            $assignees->holdersOf($assignmentResult->currentAssignments()),
        );
    }
}
