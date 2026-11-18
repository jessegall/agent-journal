<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Processes\StartSampleRequest;
use App\Processes\Commands\StartSample;
use Illuminate\Http\JsonResponse;

/**
 * Starts a request's approved sample once and answers the run the supervisor then runs.
 */
final readonly class StartSampleController
{
    public function __invoke(StartSampleRequest $request, string $commandRequest, CommandBus $commands): JsonResponse
    {
        $runId = $commands->run(new StartSample($commandRequest, $request->permit(), $request->requestKey()));

        return new JsonResponse(['run_id' => $runId]);
    }
}
