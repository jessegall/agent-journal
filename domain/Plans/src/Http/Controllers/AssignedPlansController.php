<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use Domain\Plans\Contracts\PlanResolver;
use Domain\Plans\Http\Data\AssignedPlanListData;
use Domain\Plans\Http\Requests\AssignedPlansRequest;
use Illuminate\Http\JsonResponse;

/**
 * Answers a signed agent call with the plans that agent holds directly.
 */
final readonly class AssignedPlansController
{
    /**
     * A plain 200: the call is a POST only because its body is signed, and it reads without creating anything.
     */
    public function __invoke(AssignedPlansRequest $request, PlanResolver $plans): JsonResponse
    {
        return new JsonResponse(AssignedPlanListData::from($plans->assignedToCaller($request->filters())));
    }
}
