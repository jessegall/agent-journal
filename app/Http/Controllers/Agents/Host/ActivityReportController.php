<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Agents\Commands\ReportRuntimeActivity\ReportRuntimeActivityCommand;
use App\Agents\Values\HostContext;
use App\Bus\Contracts\CommandBus;
use App\Http\Data\Agents\RuntimeActivityReportData;
use Illuminate\Http\Response;

/**
 * Takes the host's report of a runtime's activity and hold. The host's calls run as the journal itself: a host is
 * infrastructure, never an actor.
 */
final readonly class ActivityReportController
{
    public function __invoke(RuntimeActivityReportData $report, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(
            new ReportRuntimeActivityCommand(
                $host->hostId,
                $report->runtimeId,
                $report->activity,
                $report->hold,
                $report->processGeneration,
                $report->sequence,
            ),
        );

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
