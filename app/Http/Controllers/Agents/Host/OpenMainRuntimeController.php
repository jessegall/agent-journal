<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Attributes\Bus\Dispatches;
use App\Commands\Agents\OpenHostMainRuntime\OpenHostMainRuntimeCommand;
use App\Contracts\Bus\CommandBus;
use App\Data\Agents\MainRuntimeRequestData;
use App\Values\HostContext;
use Illuminate\Http\JsonResponse;

/**
 * Opens an agent's main runtime as a terminal on the calling host, for journal-agent attach. The user at that
 * machine enrolled it, so the journal opens the root runtime itself; the host still may only use its own folders.
 */
final readonly class OpenMainRuntimeController
{
    #[Dispatches(OpenHostMainRuntimeCommand::class)]
    public function __invoke(MainRuntimeRequestData $request, HostContext $host, CommandBus $commands): JsonResponse
    {
        $opened = $commands->run(
            new OpenHostMainRuntimeCommand(
                $request->agentId,
                $host->hostId,
                $request->folder,
                $request->driver,
                $request->driverBuild,
                $request->profile,
                $request->model,
            ),
        );

        return new JsonResponse(
            [
                'session_id' => $opened->sessionId,
                'runtime_id' => $opened->runtimeId,
            ],
            JsonResponse::HTTP_CREATED,
        );
    }
}
