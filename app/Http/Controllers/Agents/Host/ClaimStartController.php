<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Agents\Commands\ClaimStart;
use App\Agents\Support\HostContext;
use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Agents\StartReportRequest;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Hands the host the pending start of a session, once; a start taken, cancelled or of an ended session is gone.
 * The host's calls run as the journal itself: a host is infrastructure, never an actor.
 */
final readonly class ClaimStartController
{
    public function __invoke(StartReportRequest $request, HostContext $host, CommandBus $commands): JsonResponse
    {
        $claimed = $commands->run(new ClaimStart($host->hostId, $request->sessionId()));

        return $claimed === null
            ? new JsonResponse(['message' => 'This start is no longer waiting for a host.'], Response::HTTP_GONE)
            : new JsonResponse([
                'start_key' => $claimed->startKey,
                'session_id' => $claimed->sessionId,
                'directory' => $claimed->directory,
                'generation' => $claimed->generation,
                'recipe' => $claimed->recipe,
            ]);
    }
}
