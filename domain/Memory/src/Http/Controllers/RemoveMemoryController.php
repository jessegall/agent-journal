<?php

declare(strict_types=1);

namespace Domain\Memory\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Memory\Http\Requests\RemoveMemoryRequest;
use Illuminate\Http\JsonResponse;

/**
 * Removes one of the caller's memories by running RemoveMemory, and answers its id.
 */
final readonly class RemoveMemoryController
{
    public function __invoke(RemoveMemoryRequest $request, CommandBus $commands): JsonResponse
    {
        return new JsonResponse(['memoryId' => $commands->run($request->command())], JsonResponse::HTTP_OK);
    }
}
