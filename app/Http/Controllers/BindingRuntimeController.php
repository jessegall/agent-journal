<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Attributes\Bus\Dispatches;
use App\Commands\Agents\OpenBindingMainRuntime\OpenBindingMainRuntimeCommand;
use App\Commands\Projects\AssertBindingRuntime\AssertBindingRuntimeCommand;
use App\Commands\Sessions\RecordBindingRuntime\RecordBindingRuntimeCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\PinnedBuilds;
use App\Data\Connections\BindingRuntimeRequestData;
use App\Models\Agents\AgentRuntime;
use App\Models\Projects\ProjectBinding;
use App\Models\Sessions\BindingRuntime;
use App\Support\Drivers\OwnTerminalPlans;
use App\Values\HostContext;
use Illuminate\Http\JsonResponse;

/**
 * Opens a binding's main runtime on its own host at its driver's pinned build: the start is checked against the binding
 * first, then the existing main-runtime opening runs for the binding's main agent in the binding's root. A start under
 * an id its device chose is recorded with its runtime, so asking again under that id answers the same runtime. The
 * answer carries the plan the device runs on its owner's terminal.
 */
final readonly class BindingRuntimeController
{
    #[Dispatches(AssertBindingRuntimeCommand::class)]
    #[Dispatches(RecordBindingRuntimeCommand::class)]
    #[Dispatches(OpenBindingMainRuntimeCommand::class)]
    public function __invoke(
        string $binding,
        BindingRuntimeRequestData $request,
        HostContext $host,
        CommandBus $commands,
        PinnedBuilds $pins,
        OwnTerminalPlans $plans,
    ): JsonResponse {
        $commands->run($request->asBindingRuntime($host->hostId, $binding));

        // A start asked again under its id, after a lost reply or a restart, answers the runtime it opened.
        $earlier = $request->startId === '' ? [] : BindingRuntime::findRuntimeForBinding($binding, $request->startId);

        foreach ($earlier as $runtime) {
            return $this->answer($binding, $runtime, $plans, JsonResponse::HTTP_OK);
        }

        $opened = $commands->run($request->asMainRuntime($host->hostId, $pins->versionOf($request->driver)));

        if ($request->startId !== '') {
            $commands->run(
                new RecordBindingRuntimeCommand($binding, $request->startId, $opened->sessionId, $opened->runtimeId),
            );
        }

        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);

        return $this->answer($binding, $runtime, $plans, JsonResponse::HTTP_CREATED);
    }

    /**
     * The runtime with the plan its device runs on the owner's terminal.
     */
    private function answer(string $binding, AgentRuntime $runtime, OwnTerminalPlans $plans, int $status): JsonResponse
    {
        return new JsonResponse(
            [
                'session_id' => $runtime->agent_session_id,
                'runtime_id' => $runtime->id,
                'authority_generation' => ProjectBinding::resolveAuthorityGenerationOf($binding),
                'plan' => $plans->of($runtime)->payload(),
            ],
            $status,
        );
    }
}
