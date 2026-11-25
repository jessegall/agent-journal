<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Attributes\Bus\Dispatches;
use App\Commands\Agents\OpenBindingMainRuntime\OpenBindingMainRuntimeCommand;
use App\Commands\Projects\AssertBindingRuntime\AssertBindingRuntimeCommand;
use App\Commands\Sessions\RecordBindingRuntime\RecordBindingRuntimeCommand;
use App\Contracts\Bus\CommandBus;
use App\Data\Connections\BindingRuntimeRequestData;
use App\Models\Projects\ProjectBinding;
use App\Models\Sessions\BindingRuntime;
use App\Values\HostContext;
use Illuminate\Http\JsonResponse;

/**
 * Opens a binding's main runtime on its own host: the start is checked against the binding first, then the
 * existing main-runtime opening runs for the binding's main agent in the binding's root. A start under an id its
 * device chose is recorded with its runtime, so asking again under that id answers the same runtime.
 */
final readonly class BindingRuntimeController
{
    #[Dispatches(OpenBindingMainRuntimeCommand::class)]
    #[Dispatches(AssertBindingRuntimeCommand::class)]
    #[Dispatches(RecordBindingRuntimeCommand::class)]
    public function __invoke(
        string $binding,
        BindingRuntimeRequestData $request,
        HostContext $host,
        CommandBus $commands,
    ): JsonResponse {
        $commands->run($request->asBindingRuntime($host->hostId, $binding));

        // A start asked again under its id, after a lost reply or a restart, answers the runtime it opened.
        foreach ($request->startId === '' ? [] : BindingRuntime::findForBinding($binding, $request->startId) as $earlier) {
            return $this->answer($binding, $earlier->session_id, $earlier->runtime_id, JsonResponse::HTTP_OK);
        }

        $opened = $commands->run($request->asMainRuntime($host->hostId));

        if ($request->startId !== '') {
            $commands->run(
                new RecordBindingRuntimeCommand($binding, $request->startId, $opened->sessionId, $opened->runtimeId),
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
                'authority_generation' => ProjectBinding::resolveAuthorityGenerationOf($binding),
            ],
            $status,
        );
    }
}
