<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Agents\Support\HostContext;
use App\Bus\Contracts\CommandBus;
use App\Http\Data\Agents\UsageReportData;
use Illuminate\Http\Response;

/**
 * Takes the host's report of one usage measurement on a start it claimed; a duplicate is acknowledged like the first.
 * The host's calls run as the journal itself: a host is infrastructure, never an actor.
 */
final readonly class UsageReportController
{
    public function __invoke(UsageReportData $report, HostContext $host, CommandBus $commands): Response
    {
        $commands->run($report->commandFor($host->hostId));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
