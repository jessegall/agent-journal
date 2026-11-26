<?php

declare(strict_types=1);

namespace App\Http\Controllers\Assignments;

use App\Assignments\Commands\ConfigureAutoAssignment\ConfigureAutoAssignmentCommand;
use App\Assignments\Data\AutoAssignmentChangeData;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Assignments\ChangeAutoAssignmentRequest;
use App\Records\Contracts\RecordResolver;
use Illuminate\Http\JsonResponse;

/**
 * Gives an actor's auto-assignment of one type a new pool and size, against the revision the caller read.
 */
final readonly class ConfigureAutoAssignmentController
{
    #[Dispatches(ConfigureAutoAssignmentCommand::class)]
    public function __invoke(
        ChangeAutoAssignmentRequest $request,
        RecordResolver $records,
        CommandBus $commands,
    ): JsonResponse {
        return new JsonResponse(AutoAssignmentChangeData::of($commands->run($request->configureCommand($records))));
    }
}
