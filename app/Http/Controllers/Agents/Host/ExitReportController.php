<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Commands\ReportRuntimeExit\ReportRuntimeExitCommand;
use App\Contracts\CommandBus;
use App\Data\Agents\RuntimeLivenessReportData;
use App\Values\HostContext;
use Illuminate\Http\Response;

/**
 * Takes the host's verified report that a runtime's driver exited. The host's calls run as the journal itself: a host
 * is infrastructure, never an actor.
 */
final readonly class ExitReportController
{
    public function __invoke(RuntimeLivenessReportData $report, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(
            new ReportRuntimeExitCommand($host->hostId, $report->runtimeId, $report->processGeneration, $report->evidence),
        );

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
