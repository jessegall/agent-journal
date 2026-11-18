<?php

declare(strict_types=1);

namespace App\Assignments\Http\Controllers;

use App\Assignments\Contracts\AssigneeReader;
use App\Assignments\Contracts\AssignmentReader;
use App\Assignments\Http\Data\RecordHolderData;
use App\Assignments\Http\Requests\ShowAssignmentRequest;
use Illuminate\Http\JsonResponse;

/**
 * Shows who holds one record, with the reference a deliberate change must name.
 */
final readonly class ShowAssignmentController
{
    public function __invoke(ShowAssignmentRequest $request, AssignmentReader $assignments, AssigneeReader $assignees): JsonResponse
    {
        $record = $request->record();
        $holders = $assignees->holdersOf($assignments->assignmentsFor([$record]));

        return new JsonResponse(RecordHolderData::of($record, $holders->forRecord($record)));
    }
}
