<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Calls;

use App\Contracts\AssigneeResolver;
use App\Contracts\CommandBus;
use App\Contracts\RecordResolver;
use Domain\Plans\Calls\UnassignPlanWorkCall;
use Domain\Plans\Commands\UnassignPlanWork\UnassignPlanWorkCommand;
use Domain\Plans\Data\PlanWorkResultData;

/**
 * Unassigns the work under a plan or phase and answers what changed.
 */
final readonly class UnassignPlanWorkController
{
    public function __invoke(
        UnassignPlanWorkCall $call,
        CommandBus $commands,
        RecordResolver $records,
        AssigneeResolver $assignees,
    ): PlanWorkResultData {
        $root = $call->rootRecord($records);
        $assignmentResult = $commands->run(new UnassignPlanWorkCommand($root, $call->expected()));

        return PlanWorkResultData::of(
            $root,
            $assignmentResult,
            $assignees->holdersOf($assignmentResult->currentAssignments()),
        );
    }
}
