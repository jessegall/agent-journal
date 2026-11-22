<?php

declare(strict_types=1);

namespace App\Http\Controllers\Hooks\Host;

use App\Commands\RecordStopResults\RecordStopResultsCommand;
use App\Contracts\Bus\CommandBus;
use App\Http\Requests\Hooks\StopResultsRequest;
use App\Values\HostContext;
use Illuminate\Http\JsonResponse;

/**
 * Takes the host's results for the conditions of one stop attempt and answers the state they settled it in.
 * The host's calls run as the journal itself: a host is infrastructure, never an actor.
 */
final readonly class StopResultsController
{
    public function __invoke(StopResultsRequest $request, HostContext $host, CommandBus $commands): JsonResponse
    {
        $state = $commands->run(new RecordStopResultsCommand(
            $host->hostId,
            $request->attemptId(),
            $request->policyDigest(),
            $request->workspaceGeneration(),
            $request->results(),
        ));

        return new JsonResponse(['state' => $state->value]);
    }
}
