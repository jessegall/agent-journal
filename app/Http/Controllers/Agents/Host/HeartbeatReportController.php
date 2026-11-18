<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Agents\Commands\ReportRuntimeHeartbeat;
use App\Agents\Support\HostContext;
use App\Bus\Contracts\CommandBus;
use App\Http\Data\Agents\RuntimeLivenessReportData;
use Illuminate\Http\Response;

/**
 * Takes the host's liveness evidence for a runtime as its session's heartbeat. The host's calls run as the journal itself: a host is infrastructure, never an actor.
 */
final readonly class HeartbeatReportController
{
    public function __invoke(RuntimeLivenessReportData $report, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(new ReportRuntimeHeartbeat($host->hostId, $report->runtimeId, $report->processGeneration, $report->evidence));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
