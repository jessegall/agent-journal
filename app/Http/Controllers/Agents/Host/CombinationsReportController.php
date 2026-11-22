<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Agents\Commands\RecordHostCombinations\RecordHostCombinationsCommand;
use App\Agents\Data\HostCombinationsData;
use App\Agents\Values\HostContext;
use App\Bus\Contracts\CommandBus;
use Illuminate\Http\Response;

/**
 * Takes the protocol version a host speaks and the combinations it can run. The host's calls run as the journal
 * itself: a host is infrastructure, never an actor.
 */
final readonly class CombinationsReportController
{
    public function __invoke(HostCombinationsData $report, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(new RecordHostCombinationsCommand($host->hostId, $report->protocolVersion, $report->combinations()));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
