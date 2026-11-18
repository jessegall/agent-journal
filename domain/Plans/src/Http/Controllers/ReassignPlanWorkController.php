<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Assignments\Contracts\AssigneeReader;
use Domain\Plans\Contracts\PlanAssignments;
use Domain\Plans\Http\Data\PlanWorkResultData;
use Domain\Plans\Http\Requests\ReassignPlanWorkRequest;
use Illuminate\Http\JsonResponse;

/**
 * Moves a plan or phase and its unfinished work to another holder in one call. The services come with each call, since a route keeps its controller between requests.
 */
final readonly class ReassignPlanWorkController
{
    public function __invoke(ReassignPlanWorkRequest $request, PlanAssignments $cascades, AssigneeReader $assignees): JsonResponse
    {
        $root = $request->rootRecord();
        $result = $cascades->reassign($root, $request->expectedRoot(), $request->recipient());

        return new JsonResponse(PlanWorkResultData::of($root, $result, $assignees->holdersOf($result->currentAssignments())));
    }
}
