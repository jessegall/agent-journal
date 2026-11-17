<?php

declare(strict_types=1);

namespace App\Domain\Plans\Http\Controllers;

use App\Domain\Plans\Contracts\PlanReader;
use App\Domain\Plans\Http\Data\AssignedPlanListData;
use App\Domain\Plans\Http\Requests\AssignedPlansRequest;
use Illuminate\Http\JsonResponse;

/**
 * Answers a signed agent call with the plans that agent holds directly.
 */
final readonly class AssignedPlansController
{
    /**
     * A plain 200: the call is a POST only because its body is signed, and it reads without creating anything.
     */
    public function __invoke(AssignedPlansRequest $request, PlanReader $plans): JsonResponse
    {
        return new JsonResponse(AssignedPlanListData::from($plans->assignedToCaller($request->filters())));
    }
}
