<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Attributes\Bus\Dispatches;
use App\Commands\Agents\NotifyRuntimeHeartbeat\NotifyRuntimeHeartbeatCommand;
use App\Contracts\Bus\CommandBus;
use App\Data\Agents\RuntimeLivenessReportData;
use App\Values\HostContext;
use Illuminate\Http\Response;

/**
 * Takes the host's liveness evidence for a runtime as its session's heartbeat. The host's calls run as the journal
 * itself: a host is infrastructure, never an actor.
 */
final readonly class HeartbeatReportController
{
    #[Dispatches(NotifyRuntimeHeartbeatCommand::class)]
    public function __invoke(RuntimeLivenessReportData $report, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(
            new NotifyRuntimeHeartbeatCommand(
                $host->hostId,
                $report->runtimeId,
                $report->processGeneration,
                $report->evidence,
            ),
        );

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
