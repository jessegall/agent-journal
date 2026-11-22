<?php

declare(strict_types=1);

namespace App\Http\Controllers\Assignments;

use App\Commands\UnassignRecord\UnassignRecordCommand;
use App\Contracts\AssigneeResolver;
use App\Contracts\CommandBus;
use App\Data\Assignments\AssignmentResultData;
use App\Http\Requests\Assignments\UnassignRecordRequest;
use Illuminate\Http\JsonResponse;

/**
 * Releases one record from the holder it is expected to have. A plain 200: an agent's call is a POST because its body
 * is signed.
 */
final readonly class UnassignRecordController
{
    public function __invoke(
        UnassignRecordRequest $request,
        CommandBus $commands,
        AssigneeResolver $assignees,
    ): JsonResponse {
        $assignmentChange = $commands->run(new UnassignRecordCommand($request->record(), $request->expected()));

        return new JsonResponse(
            AssignmentResultData::of($assignmentChange, $assignees->holdersOf($assignmentChange->currentAssignments())),
        );
    }
}
