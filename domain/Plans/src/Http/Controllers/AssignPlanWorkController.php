<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Assignments\Contracts\AssigneeReader;
use Domain\Plans\Contracts\PlanAssignments;
use Domain\Plans\Http\Data\PlanWorkResultData;
use Domain\Plans\Http\Requests\AssignPlanWorkRequest;
use Illuminate\Http\JsonResponse;

/**
 * Gives a plan or phase and its unfinished work to one holder in one call. The services come with each call, since a route keeps its controller between requests.
 */
final readonly class AssignPlanWorkController
{
    public function __invoke(AssignPlanWorkRequest $request, PlanAssignments $cascades, AssigneeReader $assignees): JsonResponse
    {
        $root = $request->rootRecord();
        $result = $cascades->assign($root, $request->recipient());

        return new JsonResponse(PlanWorkResultData::of($root, $result, $assignees->holdersOf($result->currentAssignments())));
    }
}
