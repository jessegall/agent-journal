<?php

declare(strict_types=1);

namespace App\Core\Assignments\Http\Controllers;

use App\Core\Assignments\Contracts\AssigneeReader;
use App\Core\Assignments\Contracts\AssignmentWriter;
use App\Core\Assignments\Http\Data\AssignmentResultData;
use App\Core\Assignments\Http\Requests\ReassignRecordRequest;
use Illuminate\Http\JsonResponse;

/**
 * Moves one record from the holder it is expected to have to another. A plain 200: an agent's call is a POST because its body is signed.
 */
final readonly class ReassignRecordController
{
    public function __invoke(ReassignRecordRequest $request, AssignmentWriter $writer, AssigneeReader $assignees): JsonResponse
    {
        $result = $writer->reassign($request->record(), $request->expected(), $request->recipient());

        return new JsonResponse(AssignmentResultData::of($result, $assignees->holdersOf($result->currentAssignments())));
    }
}
