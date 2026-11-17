<?php

declare(strict_types=1);

namespace App\Domain\Plans\Http\Controllers;

use App\Core\Assignments\Contracts\AssigneeReader;
use App\Domain\Plans\Contracts\PlanAssignments;
use App\Domain\Plans\Http\Data\PlanWorkResultData;
use App\Domain\Plans\Http\Requests\AssignPlanWorkRequest;
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
