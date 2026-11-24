<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Commands\Starts\NotifyCleanup\NotifyCleanupCommand;
use App\Contracts\Bus\CommandBus;
use App\Enums\CleanupStep;
use App\Http\Requests\Agents\CleanupReportRequest;
use App\Models\Starts\CleanupOperation;
use App\Values\HostContext;
use Illuminate\Http\JsonResponse;

/**
 * The host reads the cleanups of ended launches it still owes, by session and with the resources left, and reports
 * each pass it made.
 * The host's calls run as the journal itself: a host is infrastructure, never an actor.
 */
final readonly class CleanupReportController
{
    /**
     * The most pending cleanups one read hands the host.
     */
    private const int PENDING_LIMIT = 50;

    public function index(HostContext $host): JsonResponse
    {
        $pending = array_map(
            fn (CleanupOperation $cleanup) => [
                'session_id' => $cleanup->agent_session_id,
                'remaining' => array_map(fn (CleanupStep $step) => $step->value, $cleanup->remainingSteps),
            ],
            CleanupOperation::pendingOn($host->hostId, self::PENDING_LIMIT),
        );

        return new JsonResponse(['pending' => $pending]);
    }

    public function __invoke(CleanupReportRequest $request, HostContext $host, CommandBus $commands): JsonResponse
    {
        $state = $commands->run(new NotifyCleanupCommand($host->hostId, $request->sessionId(), $request->report()));

        return new JsonResponse(['state' => $state->value]);
    }
}
