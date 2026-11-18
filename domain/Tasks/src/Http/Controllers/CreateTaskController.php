<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Tasks\Http\Requests\CreateTaskRequest;
use Illuminate\Http\JsonResponse;

/**
 * Creates a task for a signed agent call by running the CreateTask command, and answers its id.
 */
final readonly class CreateTaskController
{
    public function __invoke(CreateTaskRequest $request, CommandBus $commands): JsonResponse
    {
        return new JsonResponse(['taskId' => $commands->run($request->command())], JsonResponse::HTTP_CREATED);
    }
}
