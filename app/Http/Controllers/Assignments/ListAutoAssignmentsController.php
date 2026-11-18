<?php

declare(strict_types=1);

namespace App\Http\Controllers\Assignments;

use App\Actors\Contracts\CurrentActor;
use App\Assignments\Contracts\AutoAssignmentAccess;
use App\Assignments\Contracts\AutoAssignmentReader;
use App\Http\Data\Assignments\AutoAssignmentPageData;
use App\Http\Requests\Assignments\ListAutoAssignmentsRequest;
use Illuminate\Http\JsonResponse;

/**
 * Lists one actor's auto-assignments by id, a page at a time, for a caller allowed to read them.
 */
final readonly class ListAutoAssignmentsController
{
    public function __invoke(
        ListAutoAssignmentsRequest $request,
        CurrentActor $actors,
        AutoAssignmentAccess $access,
        AutoAssignmentReader $autoAssignments,
    ): JsonResponse {
        $actor = $request->actor();
        $access->requireRead($actors->actor(), $actor);

        return new JsonResponse(AutoAssignmentPageData::of($autoAssignments->listFor($actor, $request->page())));
    }
}
