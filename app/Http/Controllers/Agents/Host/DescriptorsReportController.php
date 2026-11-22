<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Agents\Commands\RecordHostDescriptors\RecordHostDescriptorsCommand;
use App\Agents\Data\HostDescriptorsData;
use App\Agents\Values\HostContext;
use App\Bus\Contracts\CommandBus;
use Illuminate\Http\Response;

/**
 * Takes the protocol version a host speaks and the driver descriptors it can run. The host's calls run as the journal
 * itself: a host is infrastructure, never an actor.
 */
final readonly class DescriptorsReportController
{
    public function __invoke(HostDescriptorsData $report, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(new RecordHostDescriptorsCommand($host->hostId, $report->protocolVersion, $report->descriptors()));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
