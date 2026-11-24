<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Commands\Starts\RecordBindingStart\RecordBindingStartCommand;
use App\Contracts\Bus\CommandBus;
use App\Data\Connections\BindingRuntimeRequestData;
use App\Models\Projects\ProjectBinding;
use App\Models\Starts\BindingStart;
use App\Values\HostContext;
use Illuminate\Http\JsonResponse;

/**
 * Opens a binding's main runtime on its own host: the start is checked against the binding first, then the
 * existing main-runtime opening runs for the binding's main agent in the binding's root. A start under an id its
 * device chose is recorded with its runtime, so asking again under that id answers the same runtime.
 */
final readonly class BindingRuntimeController
{
    public function __invoke(
        string $binding,
        BindingRuntimeRequestData $request,
        HostContext $host,
        CommandBus $commands,
    ): JsonResponse {
        $commands->run($request->asBindingStart($host->hostId, $binding));

        // A start asked again under its id, after a lost reply or a restart, answers the runtime it opened.
        foreach ($request->startId === '' ? [] : BindingStart::ofBinding($binding, $request->startId) as $earlier) {
            return $this->answer($binding, $earlier->session_id, $earlier->runtime_id, JsonResponse::HTTP_OK);
        }

        $opened = $commands->run($request->asMainRuntime($host->hostId));

        if ($request->startId !== '') {
            $commands->run(
                new RecordBindingStartCommand($binding, $request->startId, $opened->sessionId, $opened->runtimeId),
            );
        }

        return $this->answer($binding, $opened->sessionId, $opened->runtimeId, JsonResponse::HTTP_CREATED);
    }

    private function answer(string $binding, string $sessionId, string $runtimeId, int $status): JsonResponse
    {
        return new JsonResponse(
            [
                'session_id' => $sessionId,
                'runtime_id' => $runtimeId,
                'authority_generation' => ProjectBinding::authorityGenerationOf($binding),
            ],
            $status,
        );
    }
}
