<?php

declare(strict_types=1);

namespace App\Assignments\Http\Controllers;

use App\Assignments\Contracts\AssigneeReader;
use App\Assignments\Contracts\AssignmentWriter;
use App\Assignments\Http\Data\AssignmentResultData;
use App\Assignments\Http\Requests\AssignRecordRequest;
use Illuminate\Http\JsonResponse;

/**
 * Gives one record to a holder. A plain 200: an agent's call is a POST because its body is signed.
 */
final readonly class AssignRecordController
{
    public function __invoke(AssignRecordRequest $request, AssignmentWriter $writer, AssigneeReader $assignees): JsonResponse
    {
        $result = $writer->assign($request->record(), $request->recipient());

        return new JsonResponse(AssignmentResultData::of($result, $assignees->holdersOf($result->currentAssignments())));
    }
}
