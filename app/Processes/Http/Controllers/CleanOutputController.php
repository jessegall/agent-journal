<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Processes\CleanOutputRequest;
use App\Processes\Commands\CleanProcessOutput;
use Illuminate\Http\JsonResponse;

/**
 * Previews or removes the stored output of ended runs; only a user may, the bus refuses an agent.
 */
final readonly class CleanOutputController
{
    public function __invoke(CleanOutputRequest $request, CommandBus $commands): JsonResponse
    {
        $preview = $commands->run(new CleanProcessOutput($request->runIds(), $request->previewOnly()));

        return new JsonResponse([
            'runs' => $preview->runIds,
            'parts' => $preview->partRunIds,
            'bytes' => $preview->bytes,
            'removed' => $preview->removed,
        ]);
    }
}
