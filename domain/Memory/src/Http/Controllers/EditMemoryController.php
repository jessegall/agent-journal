<?php

declare(strict_types=1);

namespace Domain\Memory\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Memory\Http\Requests\EditMemoryRequest;
use Illuminate\Http\JsonResponse;

/**
 * Changes one of the caller's memories by running EditMemory, and answers its id.
 */
final readonly class EditMemoryController
{
    public function __invoke(EditMemoryRequest $request, CommandBus $commands): JsonResponse
    {
        return new JsonResponse(['memoryId' => $commands->run($request->command())], JsonResponse::HTTP_OK);
    }
}
