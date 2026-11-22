<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Agents\Commands\RecordHostProtection\RecordHostProtectionCommand;
use App\Agents\Data\ProtectionReportData;
use App\Agents\Values\HostContext;
use App\Bus\Contracts\CommandBus;
use Illuminate\Http\Response;

/**
 * Takes what a contained host found of a driver's protection in the agent image. The host's calls run as the
 * journal itself: a host is infrastructure, never an actor.
 */
final readonly class ProtectionReportController
{
    public function __invoke(ProtectionReportData $report, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(new RecordHostProtectionCommand($host->hostId, $report->report()));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
