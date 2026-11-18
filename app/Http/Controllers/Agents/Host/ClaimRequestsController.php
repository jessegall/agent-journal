<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Agents\Commands\ClaimDriverRequests;
use App\Agents\Support\HostContext;
use App\Bus\Contracts\CommandBus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Hands the host its next requests; when none waits it polls again for a short bounded time. The host's calls run as the journal itself: a host is infrastructure, never an actor.
 */
final readonly class ClaimRequestsController
{
    public function __invoke(Request $request, HostContext $host, CommandBus $commands): JsonResponse
    {
        $limit = min(20, max(1, $request->integer('limit', 10)));
        $deadline = microtime(true) + min(10, max(0, $request->integer('wait', 0)));

        do {
            $claimed = $commands->run(new ClaimDriverRequests($host->hostId, $limit));
            if (! $claimed->isEmpty() || microtime(true) >= $deadline) {
                return new JsonResponse(['requests' => $claimed->requests]);
            }
            usleep(250_000);
        } while (true);
    }
}
