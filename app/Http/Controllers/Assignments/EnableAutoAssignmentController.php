<?php

declare(strict_types=1);

namespace App\Http\Controllers\Assignments;

use App\Contracts\CommandBus;
use App\Contracts\RecordResolver;
use App\Data\Assignments\AutoAssignmentChangeData;
use App\Http\Requests\Assignments\ChangeAutoAssignmentRequest;
use Illuminate\Http\JsonResponse;

/**
 * Turns an actor's auto-assignment of one type on with a pool and size, against the revision the caller read.
 */
final readonly class EnableAutoAssignmentController
{
    public function __invoke(
        ChangeAutoAssignmentRequest $request,
        RecordResolver $records,
        CommandBus $commands,
    ): JsonResponse {
        return new JsonResponse(AutoAssignmentChangeData::of($commands->run($request->enableCommand($records))));
    }
}
