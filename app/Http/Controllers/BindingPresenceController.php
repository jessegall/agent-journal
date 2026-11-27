<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Connections\Data\PresenceReportData;
use App\Hosts\Values\HostContext;
use App\Projects\Commands\RecordBindingPresence\RecordBindingPresenceCommand;
use Illuminate\Http\JsonResponse;

/**
 * Takes a binding relay's presence report, signed by its host, and answers the boot generation and presence expiry
 * the journal now holds. It needs no runtime, unlike the runtime heartbeat.
 */
final readonly class BindingPresenceController
{
    #[Dispatches(RecordBindingPresenceCommand::class)]
    public function __invoke(
        string $binding,
        PresenceReportData $report,
        HostContext $host,
        CommandBus $commands,
    ): JsonResponse {
        $receipt = $commands->run(new RecordBindingPresenceCommand($host->hostId, $binding, $report->report()));

        return new JsonResponse($receipt);
    }
}
