<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Assignments\Contracts\AssigneeReader;
use Domain\Plans\Contracts\PlanAssignments;
use Domain\Plans\Http\Data\PlanWorkResultData;
use Domain\Plans\Http\Requests\UnassignPlanWorkRequest;
use Illuminate\Http\JsonResponse;

/**
 * Releases a plan or phase and its unfinished work in one call. The services come with each call, since a route keeps its controller between requests.
 */
final readonly class UnassignPlanWorkController
{
    public function __invoke(UnassignPlanWorkRequest $request, PlanAssignments $cascades, AssigneeReader $assignees): JsonResponse
    {
        $root = $request->rootRecord();
        $result = $cascades->unassign($root, $request->expectedRoot());

        return new JsonResponse(PlanWorkResultData::of($root, $result, $assignees->holdersOf($result->currentAssignments())));
    }
}
