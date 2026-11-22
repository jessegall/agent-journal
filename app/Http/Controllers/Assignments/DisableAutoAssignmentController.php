<?php

declare(strict_types=1);

namespace App\Http\Controllers\Assignments;

use App\Contracts\Bus\CommandBus;
use App\Data\Assignments\AutoAssignmentChangeData;
use App\Http\Requests\Assignments\DisableAutoAssignmentRequest;
use Illuminate\Http\JsonResponse;

/**
 * Turns an actor's auto-assignment of one type off, keeping its pool and size.
 */
final readonly class DisableAutoAssignmentController
{
    public function __invoke(DisableAutoAssignmentRequest $request, CommandBus $commands): JsonResponse
    {
        return new JsonResponse(AutoAssignmentChangeData::of($commands->run($request->command())));
    }
}
