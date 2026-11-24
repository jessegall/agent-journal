<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Commands\NotifyRuntimeActivity\NotifyRuntimeActivityCommand;
use App\Contracts\Bus\CommandBus;
use App\Data\Agents\RuntimeActivityReportData;
use App\Values\HostContext;
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
            new NotifyRuntimeActivityCommand(
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
