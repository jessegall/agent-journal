<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Commands\ReportDriverTurn\ReportDriverTurnCommand;
use App\Contracts\CommandBus;
use App\Data\Agents\DriverTurnReportData;
use App\Values\HostContext;
use Illuminate\Http\Response;

/**
 * Takes the host's report of a native turn starting or finishing. The host's calls run as the journal itself: a host is
 * infrastructure, never an actor.
 */
final readonly class TurnReportController
{
    public function __invoke(DriverTurnReportData $report, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(
            new ReportDriverTurnCommand(
                $host->hostId,
                $report->runtimeId,
                $report->processGeneration,
                $report->nativePromptId,
                $report->finished,
                $report->model,
                $report->effort,
                $report->outcome,
            ),
        );

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
