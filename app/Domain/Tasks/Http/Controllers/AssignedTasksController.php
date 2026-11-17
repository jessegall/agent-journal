<?php

declare(strict_types=1);

namespace App\Domain\Tasks\Http\Controllers;

use App\Domain\Tasks\Contracts\AssignedTaskReader;
use App\Domain\Tasks\Http\Data\AssignedTaskListData;
use App\Domain\Tasks\Http\Requests\AssignedTasksRequest;
use Illuminate\Http\JsonResponse;

/**
 * Answers a signed agent call with the tasks that agent holds directly.
 */
final readonly class AssignedTasksController
{
    /**
     * A plain 200: the call is a POST only because its body is signed, and it reads without creating anything.
     */
    public function __invoke(AssignedTasksRequest $request, AssignedTaskReader $tasks): JsonResponse
    {
        return new JsonResponse(AssignedTaskListData::from($tasks->assignedToCaller($request->filters())));
    }
}
