<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Assignments\Contracts\AssigneeResolver;
use App\Bus\Contracts\CommandBus;
use Domain\Plans\Commands\ReassignPlanWork;
use Domain\Plans\Http\Data\PlanWorkResultData;
use Domain\Plans\Http\Requests\ReassignPlanWorkRequest;
use Illuminate\Http\JsonResponse;

/**
 * Moves a plan or phase and its unfinished work to another holder in one call. The services come with each call, since a route keeps its controller between requests.
 */
final readonly class ReassignPlanWorkController
{
    public function __invoke(ReassignPlanWorkRequest $request, CommandBus $commands, AssigneeResolver $assignees): JsonResponse
    {
        $root = $request->rootRecord();
        $result = $commands->run(new ReassignPlanWork($root, $request->expectedRoot(), $request->recipient()));

        return new JsonResponse(PlanWorkResultData::of($root, $result, $assignees->holdersOf($result->currentAssignments())));
    }
}
