<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Tasks\Http\Requests\EditTaskRequest;
use Illuminate\Http\JsonResponse;

/**
 * Edits a task for a signed agent call by running the EditTask command, and answers its new revision; a stale
 * revision is a 409.
 */
final readonly class EditTaskController
{
    public function __invoke(EditTaskRequest $request, CommandBus $commands): JsonResponse
    {
        $command = $request->command();

        return new JsonResponse(['taskId' => $command->taskId, 'revision' => $commands->run($command)]);
    }
}
