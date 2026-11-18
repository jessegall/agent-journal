<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Plans\Http\Requests\AddPhaseTasksRequest;
use Illuminate\Http\JsonResponse;

/**
 * Adds tasks to a phase for a signed agent call by running AddPhaseTasks: all of them or, on any invisible task or a
 * stale revision, none.
 */
final readonly class AddPhaseTasksController
{
    public function __invoke(AddPhaseTasksRequest $request, CommandBus $commands): JsonResponse
    {
        $command = $request->command();
        $commands->run($command);

        return new JsonResponse(['phaseId' => $command->phaseId, 'added' => count($command->taskIds)]);
    }
}
