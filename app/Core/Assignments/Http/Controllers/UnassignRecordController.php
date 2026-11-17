<?php

declare(strict_types=1);

namespace App\Core\Assignments\Http\Controllers;

use App\Core\Assignments\Contracts\AssigneeReader;
use App\Core\Assignments\Contracts\AssignmentWriter;
use App\Core\Assignments\Http\Data\AssignmentResultData;
use App\Core\Assignments\Http\Requests\UnassignRecordRequest;
use Illuminate\Http\JsonResponse;

/**
 * Releases one record from the holder it is expected to have. A plain 200: an agent's call is a POST because its body is signed.
 */
final readonly class UnassignRecordController
{
    public function __invoke(UnassignRecordRequest $request, AssignmentWriter $writer, AssigneeReader $assignees): JsonResponse
    {
        $result = $writer->unassign($request->record(), $request->expected());

        return new JsonResponse(AssignmentResultData::of($result, $assignees->holdersOf($result->currentAssignments())));
    }
}
