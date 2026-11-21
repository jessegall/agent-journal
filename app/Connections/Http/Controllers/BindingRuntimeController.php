<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers;

use App\Agents\Commands\OpenHostMainRuntime;
use App\Agents\Values\HostContext;
use App\Bus\Contracts\CommandBus;
use App\Connections\Commands\AssertBindingStart;
use App\Connections\Models\ProjectBinding;
use App\Http\Data\Connections\BindingRuntimeRequestData;
use Illuminate\Http\JsonResponse;

/**
 * Opens a binding's main runtime on its own host: the start is checked against the binding first, then the
 * existing main-runtime opening runs for the binding's main agent in the binding's root.
 */
final readonly class BindingRuntimeController
{
    public function __invoke(
        string $binding,
        BindingRuntimeRequestData $request,
        HostContext $host,
        CommandBus $commands,
    ): JsonResponse {
        $commands->run(
            new AssertBindingStart($host->hostId, $binding, $request->rootId, $request->folder, $request->agentId),
        );

        $opened = $commands->run(new OpenHostMainRuntime(
            $request->agentId,
            $host->hostId,
            $request->folder,
            $request->driver,
            $request->driverBuild,
            $request->profile,
            $request->model,
        ));

        return new JsonResponse(
            [
                'session_id' => $opened->sessionId,
                'runtime_id' => $opened->runtimeId,
                'authority_generation' => ProjectBinding::authorityGenerationOf($binding),
            ],
            JsonResponse::HTTP_CREATED,
        );
    }
}
