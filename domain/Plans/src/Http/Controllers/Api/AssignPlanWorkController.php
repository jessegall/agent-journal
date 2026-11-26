<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers\Api;

use App\Assignments\Contracts\AssigneeResolver;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Records\Contracts\RecordResolver;
use Domain\Plans\Api\AssignPlanWorkPayload;
use Domain\Plans\Commands\AssignPlanWork\AssignPlanWorkCommand;
use Domain\Plans\Data\PlanWorkResultData;

/**
 * Assigns the work under a plan or phase and answers what changed.
 */
final readonly class AssignPlanWorkController
{
    #[Dispatches(AssignPlanWorkCommand::class)]
    public function __invoke(
        AssignPlanWorkPayload $call,
        CommandBus $commands,
        RecordResolver $records,
        AssigneeResolver $assignees,
    ): PlanWorkResultData {
        $root = $call->rootRecord($records);
        $assignmentResult = $commands->run(new AssignPlanWorkCommand($root, $call->recipient()));

        return PlanWorkResultData::of(
            $root,
            $assignmentResult,
            $assignees->holdersOf($assignmentResult->currentAssignments()),
        );
    }
}
