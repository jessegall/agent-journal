<?php

declare(strict_types=1);

namespace App\Http\Controllers\Assignments;

use App\Assignments\Commands\DisableAutoAssignment\DisableAutoAssignmentCommand;
use App\Assignments\Data\AutoAssignmentChangeData;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Assignments\DisableAutoAssignmentRequest;
use Illuminate\Http\JsonResponse;

/**
 * Turns an actor's auto-assignment of one type off, keeping its pool and size.
 */
final readonly class DisableAutoAssignmentController
{
    #[Dispatches(DisableAutoAssignmentCommand::class)]
    public function __invoke(DisableAutoAssignmentRequest $request, CommandBus $commands): JsonResponse
    {
        return new JsonResponse(AutoAssignmentChangeData::of($commands->run($request->command())));
    }
}
