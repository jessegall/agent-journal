<?php

declare(strict_types=1);

namespace App\Http\Controllers\Assignments;

use App\Commands\ReassignRecord\ReassignRecordCommand;
use App\Contracts\AssigneeResolver;
use App\Contracts\CommandBus;
use App\Data\Assignments\AssignmentResultData;
use App\Http\Requests\Assignments\ReassignRecordRequest;
use Illuminate\Http\JsonResponse;

/**
 * Moves one record from the holder it is expected to have to another. A plain 200: an agent's call is a POST because
 * its body is signed.
 */
final readonly class ReassignRecordController
{
    public function __invoke(
        ReassignRecordRequest $request,
        CommandBus $commands,
        AssigneeResolver $assignees,
    ): JsonResponse {
        $assignmentChange = $commands->run(new ReassignRecordCommand(
            $request->record(),
            $request->expected(),
            $request->recipient(),
        ));

        return new JsonResponse(
            AssignmentResultData::of($assignmentChange, $assignees->holdersOf($assignmentChange->currentAssignments())),
        );
    }
}
