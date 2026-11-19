<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Agents\Commands\OpenHostMainRuntime;
use App\Agents\Support\HostContext;
use App\Bus\Contracts\CommandBus;
use App\Http\Data\Agents\MainRuntimeRequestData;
use Illuminate\Http\JsonResponse;

/**
 * Opens an agent's main runtime as a terminal on the calling host, for journal-agent attach. The person at that
 * machine enrolled it, so the journal opens the root runtime itself; the host still may only use its own folders.
 */
final readonly class OpenMainRuntimeController
{
    public function __invoke(MainRuntimeRequestData $request, HostContext $host, CommandBus $commands): JsonResponse
    {
        $opened = $commands->run(
            new OpenHostMainRuntime($request->agentId, $host->hostId, $request->folder, $request->program, $request->programBuild, $request->profile, $request->model),
        );

        return new JsonResponse(
            ['session_id' => $opened->sessionId, 'runtime_id' => $opened->runtimeId],
            JsonResponse::HTTP_CREATED,
        );
    }
}
