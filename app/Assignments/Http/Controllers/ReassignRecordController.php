<?php

declare(strict_types=1);

namespace App\Assignments\Http\Controllers;

use App\Assignments\Commands\ReassignRecord;
use App\Assignments\Contracts\AssigneeReader;
use App\Assignments\Http\Data\AssignmentResultData;
use App\Assignments\Http\Requests\ReassignRecordRequest;
use App\Bus\Contracts\CommandBus;
use Illuminate\Http\JsonResponse;

/**
 * Moves one record from the holder it is expected to have to another. A plain 200: an agent's call is a POST because its body is signed.
 */
final readonly class ReassignRecordController
{
    public function __invoke(ReassignRecordRequest $request, CommandBus $commands, AssigneeReader $assignees): JsonResponse
    {
        $result = $commands->run(new ReassignRecord($request->record(), $request->expected(), $request->recipient()));

        return new JsonResponse(AssignmentResultData::of($result, $assignees->holdersOf($result->currentAssignments())));
    }
}
