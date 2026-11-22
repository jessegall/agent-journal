<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Agents\Commands\CancelLaunch;
use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Agents\CancelLaunchRequest;
use Illuminate\Http\JsonResponse;

/**
 * Cancels a launch still in progress from Home, through the existing CancelLaunch command, and answers whether a
 * runtime was told to stop.
 */
final readonly class CancelLaunchController
{
    public function __invoke(
        CancelLaunchRequest $request,
        string $agent,
        string $session,
        CommandBus $commands,
    ): JsonResponse {
        $stopped = $commands->run(new CancelLaunch($agent, $session, $request->requestId()));

        return new JsonResponse(['stopped' => $stopped]);
    }
}
