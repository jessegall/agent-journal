<?php

declare(strict_types=1);

namespace App\Http\Controllers\Processes;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Processes\ApproveSampleRequest;
use App\Processes\Commands\ApproveSample;
use Illuminate\Http\JsonResponse;

/**
 * A project owner approves one evidence sample of a request; an agent is refused by the bus.
 */
final readonly class ApproveSampleController
{
    public function __invoke(ApproveSampleRequest $request, string $commandRequest, CommandBus $commands): JsonResponse
    {
        $command = new ApproveSample($commandRequest, $request->expectedRevision(), $request->commandDigest());

        return new JsonResponse(['permit_id' => $commands->run($command)]);
    }
}
