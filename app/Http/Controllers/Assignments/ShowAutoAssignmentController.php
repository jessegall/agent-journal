<?php

declare(strict_types=1);

namespace App\Http\Controllers\Assignments;

use App\Assignments\Contracts\AutoAssignmentResolver;
use App\Assignments\Data\AutoAssignmentStatusData;
use App\Http\Requests\Assignments\ShowAutoAssignmentRequest;
use Illuminate\Http\JsonResponse;

/**
 * Shows where an actor's auto-assignment of one type stands now, for a caller allowed to read it.
 */
final readonly class ShowAutoAssignmentController
{
    public function __invoke(ShowAutoAssignmentRequest $request, AutoAssignmentResolver $assignments): JsonResponse
    {
        return new JsonResponse(AutoAssignmentStatusData::of($assignments->status($request->key())));
    }
}
