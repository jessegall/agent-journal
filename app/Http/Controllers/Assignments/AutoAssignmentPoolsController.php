<?php

declare(strict_types=1);

namespace App\Http\Controllers\Assignments;

use App\Contracts\Assignments\AssignmentProviders;
use App\Data\Assignments\PoolDefinitionData;
use App\Http\Requests\Assignments\AutoAssignmentPoolsRequest;
use Illuminate\Http\JsonResponse;

/**
 * Lists the pools a record type may be drawn from, with their labels.
 */
final readonly class AutoAssignmentPoolsController
{
    public function __invoke(AutoAssignmentPoolsRequest $request, AssignmentProviders $providers): JsonResponse
    {
        return new JsonResponse(array_map(PoolDefinitionData::of(...), $providers->pools($request->assignableType())));
    }
}
