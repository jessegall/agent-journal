<?php

declare(strict_types=1);

namespace Domain\Memory\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Memory\Http\Requests\SaveMemoryRequest;
use Illuminate\Http\JsonResponse;

/**
 * Keeps a memory for a signed agent call by running SaveMemory, and answers its id.
 */
final readonly class SaveMemoryController
{
    public function __invoke(SaveMemoryRequest $request, CommandBus $commands): JsonResponse
    {
        return new JsonResponse(['memoryId' => $commands->run($request->command())], JsonResponse::HTTP_CREATED);
    }
}
