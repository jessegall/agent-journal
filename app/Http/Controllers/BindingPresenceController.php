<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Commands\RecordBindingPresence\RecordBindingPresenceCommand;
use App\Contracts\Bus\CommandBus;
use App\Data\Connections\PresenceReportData;
use App\Values\HostContext;
use Illuminate\Http\JsonResponse;

/**
 * Takes a binding relay's presence report, signed by its host, and answers the boot generation and presence expiry
 * the journal now holds. It needs no runtime, unlike the runtime heartbeat.
 */
final readonly class BindingPresenceController
{
    public function __invoke(
        string $binding,
        PresenceReportData $report,
        HostContext $host,
        CommandBus $commands,
    ): JsonResponse {
        $receipt = $commands->run(new RecordBindingPresenceCommand($host->hostId, $binding, $report->report()));

        return new JsonResponse($receipt->toArray());
    }
}
