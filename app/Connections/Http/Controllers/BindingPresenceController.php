<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers;

use App\Agents\Values\HostContext;
use App\Bus\Contracts\CommandBus;
use App\Connections\Commands\RecordBindingPresence\RecordBindingPresenceCommand;
use App\Http\Data\Connections\PresenceReportData;
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
