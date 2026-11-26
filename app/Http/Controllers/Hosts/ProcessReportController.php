<?php

declare(strict_types=1);

namespace App\Http\Controllers\Hosts;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Hosts\Commands\NotifyHostProcess\NotifyHostProcessCommand;
use App\Hosts\Data\HostProcessReportData;
use App\Hosts\Values\HostContext;
use Illuminate\Http\Response;

/**
 * Takes the host's report that one of its processes runs, was healed, exited or was lost.
 */
final readonly class ProcessReportController
{
    #[Dispatches(NotifyHostProcessCommand::class)]
    public function __invoke(
        string $process,
        HostProcessReportData $report,
        HostContext $host,
        CommandBus $commands,
    ): Response {
        $commands->run(new NotifyHostProcessCommand($host->hostId, $process, $report));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
