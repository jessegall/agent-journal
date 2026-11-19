<?php

declare(strict_types=1);

namespace App\Http\Controllers\Assignments;

use App\Assignments\Commands\UnassignRecord;
use App\Assignments\Contracts\AssigneeResolver;
use App\Bus\Contracts\CommandBus;
use App\Http\Data\Assignments\AssignmentResultData;
use App\Http\Requests\Assignments\UnassignRecordRequest;
use Illuminate\Http\JsonResponse;

/**
 * Releases one record from the holder it is expected to have. A plain 200: an agent's call is a POST because its body is signed.
 */
final readonly class UnassignRecordController
{
    public function __invoke(UnassignRecordRequest $request, CommandBus $commands, AssigneeResolver $assignees): JsonResponse
    {
        $result = $commands->run(new UnassignRecord($request->record(), $request->expected()));

        return new JsonResponse(AssignmentResultData::of($result, $assignees->holdersOf($result->currentAssignments())));
    }
}
