<?php

declare(strict_types=1);

namespace App\Http\Controllers\Hooks\Host;

use App\Commands\Sessions\RecordStopConditionResults\RecordStopConditionResultsCommand;
use App\Contracts\Bus\CommandBus;
use App\Http\Requests\Hooks\StopConditionResultsRequest;
use App\Values\HostContext;
use Illuminate\Http\JsonResponse;

/**
 * Takes the host's results for the conditions of one stop attempt and answers the state they settled it in.
 * The host's calls run as the journal itself: a host is infrastructure, never an actor.
 */
final readonly class StopConditionResultsController
{
    public function __invoke(StopConditionResultsRequest $request, HostContext $host, CommandBus $commands): JsonResponse
    {
        $state = $commands->run(new RecordStopConditionResultsCommand(
            $host->hostId,
            $request->attemptId(),
            $request->policyDigest(),
            $request->workspaceGeneration(),
            $request->results(),
        ));

        return new JsonResponse(['state' => $state->value]);
    }
}
