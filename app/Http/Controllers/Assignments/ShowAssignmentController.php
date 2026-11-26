<?php

declare(strict_types=1);

namespace App\Http\Controllers\Assignments;

use App\Assignments\Contracts\AssigneeResolver;
use App\Assignments\Data\RecordHolderData;
use App\Http\Requests\Assignments\ShowAssignmentRequest;
use Illuminate\Http\JsonResponse;

/**
 * Shows who holds one record, with the reference a deliberate change must name.
 */
final readonly class ShowAssignmentController
{
    public function __invoke(ShowAssignmentRequest $request, AssigneeResolver $assignees): JsonResponse
    {
        $record = $request->record();
        $holders = $assignees->holdersOfRecords([$record]);

        return new JsonResponse(RecordHolderData::of($record, $holders->forRecord($record)));
    }
}
