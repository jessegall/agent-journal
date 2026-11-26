<?php

declare(strict_types=1);

namespace App\Http\Controllers\Assignments;

use App\Assignments\Commands\EnableAutoAssignment\EnableAutoAssignmentCommand;
use App\Assignments\Data\AutoAssignmentChangeData;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Assignments\ChangeAutoAssignmentRequest;
use App\Records\Contracts\RecordResolver;
use Illuminate\Http\JsonResponse;

/**
 * Turns an actor's auto-assignment of one type on with a pool and size, against the revision the caller read.
 */
final readonly class EnableAutoAssignmentController
{
    #[Dispatches(EnableAutoAssignmentCommand::class)]
    public function __invoke(
        ChangeAutoAssignmentRequest $request,
        RecordResolver $records,
        CommandBus $commands,
    ): JsonResponse {
        return new JsonResponse(AutoAssignmentChangeData::of($commands->run($request->enableCommand($records))));
    }
}
