<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Api;

use App\Contracts\Assignments\AssigneeResolver;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Records\RecordResolver;
use Domain\Plans\Api\UnassignPlanWorkPayload;
use Domain\Plans\Commands\UnassignPlanWork\UnassignPlanWorkCommand;
use Domain\Plans\Data\PlanWorkResultData;

/**
 * Unassigns the work under a plan or phase and answers what changed.
 */
final readonly class UnassignPlanWorkController
{
    public function __invoke(
        UnassignPlanWorkPayload $call,
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
