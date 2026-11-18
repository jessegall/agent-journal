<?php

declare(strict_types=1);

namespace App\Http\Controllers\Assignments;

use App\Assignments\Commands\AssignRecord;
use App\Assignments\Contracts\AssigneeReader;
use App\Bus\Contracts\CommandBus;
use App\Http\Data\Assignments\AssignmentResultData;
use App\Http\Requests\Assignments\AssignRecordRequest;
use Illuminate\Http\JsonResponse;

/**
 * Gives one record to a holder. A plain 200: an agent's call is a POST because its body is signed.
 */
final readonly class AssignRecordController
{
    public function __invoke(AssignRecordRequest $request, CommandBus $commands, AssigneeReader $assignees): JsonResponse
    {
        $result = $commands->run(new AssignRecord($request->record(), $request->recipient()));

        return new JsonResponse(AssignmentResultData::of($result, $assignees->holdersOf($result->currentAssignments())));
    }
}
