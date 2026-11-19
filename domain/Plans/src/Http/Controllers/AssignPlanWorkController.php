<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Assignments\Contracts\AssigneeResolver;
use App\Bus\Contracts\CommandBus;
use Domain\Plans\Commands\AssignPlanWork;
use Domain\Plans\Http\Data\PlanWorkResultData;
use Domain\Plans\Http\Requests\AssignPlanWorkRequest;
use Illuminate\Http\JsonResponse;

/**
 * Gives a plan or phase and its unfinished work to one holder in one call. The services come with each call, since a route keeps its controller between requests.
 */
final readonly class AssignPlanWorkController
{
    public function __invoke(AssignPlanWorkRequest $request, CommandBus $commands, AssigneeResolver $assignees): JsonResponse
    {
        $root = $request->rootRecord();
        $result = $commands->run(new AssignPlanWork($root, $request->recipient()));

        return new JsonResponse(PlanWorkResultData::of($root, $result, $assignees->holdersOf($result->currentAssignments())));
    }
}
