<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Api;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Assignments\AssigneeResolver;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Records\RecordResolver;
use Domain\Plans\Api\ReassignPlanWorkPayload;
use Domain\Plans\Commands\ReassignPlanWork\ReassignPlanWorkCommand;
use Domain\Plans\Data\PlanWorkResultData;

/**
 * Reassigns the work under a plan or phase and answers what changed.
 */
final readonly class ReassignPlanWorkController
{
    #[Dispatches(ReassignPlanWorkCommand::class)]
    public function __invoke(
        ReassignPlanWorkPayload $call,
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
