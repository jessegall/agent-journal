<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Attributes\Bus\Dispatches;
use App\Commands\Accounts\AddUsageCost\AddUsageCostCommand;
use App\Commands\Accounts\RecordThreadTokens\RecordThreadTokensCommand;
use App\Commands\Accounts\RecordUsageWindow\RecordUsageWindowCommand;
use App\Contracts\Bus\CommandBus;
use App\Data\Agents\UsageReportData;
use App\Values\HostContext;
use Illuminate\Http\Response;

/**
 * Takes the host's report of one usage measurement on a start it claimed; a duplicate is acknowledged like the first.
 * The host's calls run as the journal itself: a host is infrastructure, never an actor.
 */
final readonly class UsageReportController
{
    #[Dispatches(AddUsageCostCommand::class)]
    #[Dispatches(RecordThreadTokensCommand::class)]
    #[Dispatches(RecordUsageWindowCommand::class)]
    public function __invoke(UsageReportData $report, HostContext $host, CommandBus $commands): Response
    {
        $commands->run($report->commandFor($host->hostId));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
