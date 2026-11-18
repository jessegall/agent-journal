<?php

declare(strict_types=1);

namespace App\Http\Controllers\Assignments;

use App\Bus\Contracts\CommandBus;
use App\Http\Data\Assignments\AutoAssignmentChangeData;
use App\Http\Requests\Assignments\ChangeAutoAssignmentRequest;
use App\Records\Contracts\RecordReader;
use Illuminate\Http\JsonResponse;

/**
 * Turns an actor's auto-assignment of one type on with a pool and size, against the revision the caller read.
 */
final readonly class EnableAutoAssignmentController
{
    public function __invoke(
        ChangeAutoAssignmentRequest $request,
        RecordReader $records,
        CommandBus $commands,
    ): JsonResponse {
        return new JsonResponse(AutoAssignmentChangeData::of($commands->run($request->enableCommand($records))));
    }
}
