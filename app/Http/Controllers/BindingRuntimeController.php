<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Agents\Commands\OpenBindingMainRuntime\OpenBindingMainRuntimeCommand;
use App\Agents\Drivers\Commands\RecordOwnTerminal\RecordOwnTerminalCommand;
use App\Agents\Drivers\Contracts\PinnedBuilds;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Connections\Data\BindingRuntimeRequestData;
use App\Hosts\Values\HostContext;
use App\Models\Agents\AgentRuntime;
use App\Models\Projects\ProjectBinding;
use App\Models\Sessions\BindingRuntime;
use App\Projects\Commands\AssertBindingRuntime\AssertBindingRuntimeCommand;
use App\Sessions\Commands\RecordBindingRuntime\RecordBindingRuntimeCommand;
use Illuminate\Http\JsonResponse;

/**
 * Opens a binding's main runtime on its own host at its driver's pinned build, after checking the start against the
 * binding. A start under an id its device chose is recorded with its runtime, so asking again answers the same runtime;
 * the answer carries the plan the device runs.
 */
final readonly class BindingRuntimeController
{
    #[Dispatches(AssertBindingRuntimeCommand::class)]
    #[Dispatches(RecordBindingRuntimeCommand::class)]
    #[Dispatches(OpenBindingMainRuntimeCommand::class)]
    #[Dispatches(RecordOwnTerminalCommand::class)]
    public function __invoke(
        string $binding,
        BindingRuntimeRequestData $request,
        HostContext $host,
        CommandBus $commands,
        PinnedBuilds $pins,
    ): JsonResponse {
        $commands->run($request->asBindingRuntime($host->hostId, $binding));

        // A start asked again under its id, after a lost reply or a restart, answers the runtime it opened.
        $earlier = $request->startId === null
            ? []
            : BindingRuntime::resolveRuntimeForBinding($binding, $request->startId);

        foreach ($earlier as $runtime) {
            return $this->answer($binding, $runtime, $commands, JsonResponse::HTTP_OK);
        }

        $opened = $commands->run($request->asMainRuntime($host->hostId, $pins->versionOf($request->driver)));

        if ($request->startId !== null) {
            $commands->run(
                new RecordBindingRuntimeCommand($binding, $request->startId, $opened->sessionId, $opened->runtimeId),
            );
        }

        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);

        return $this->answer($binding, $runtime, $commands, JsonResponse::HTTP_CREATED);
    }

    /**
     * The runtime with the plan its device runs on the owner's terminal.
     */
    private function answer(string $binding, AgentRuntime $runtime, CommandBus $commands, int $status): JsonResponse
    {
        $terminal = $commands->run(new RecordOwnTerminalCommand($runtime->id));

        return new JsonResponse(
            [
                'session_id' => $runtime->agent_session_id,
                'runtime_id' => $runtime->id,
                'authority_generation' => ProjectBinding::resolveAuthorityGenerationOf($binding),
                'process_id' => $terminal->processId,
                'plan' => $terminal->plan->payload(),
            ],
            $status,
        );
    }
}
