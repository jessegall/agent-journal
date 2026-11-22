<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Agents\Commands\ReportRequestProgress\ReportRequestProgressCommand;
use App\Agents\Values\HostContext;
use App\Bus\Contracts\CommandBus;
use App\Http\Data\Agents\RequestProgressReportData;
use Illuminate\Http\Response;

/**
 * Takes the host's report of how a request attempt went. The host's calls run as the journal itself: a host is
 * infrastructure, never an actor.
 */
final readonly class RequestReportController
{
    public function __invoke(RequestProgressReportData $report, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(new ReportRequestProgressCommand(
            $host->hostId,
            $report->requestId,
            $report->attempt,
            $report->progress,
            $report->actualBinding,
            $report->outcome,
            $report->scriptProgress(),
            $report->navigationReport(),
            $report->refusal(),
            $report->noProcessCreated,
            $report->binding(),
        ));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
