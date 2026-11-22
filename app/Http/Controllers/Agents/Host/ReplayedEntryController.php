<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Agents\Commands\ReportEntryReplayed\ReportEntryReplayedCommand;
use App\Agents\Values\HostContext;
use App\Bus\Contracts\CommandBus;
use App\Http\Data\Agents\EntryReplayedData;
use Illuminate\Http\Response;

/**
 * Takes the host's report that its replay of a library entry worked. The host's calls run as the journal itself,
 * never an actor.
 */
final readonly class ReplayedEntryController
{
    public function __invoke(
        string $entry,
        EntryReplayedData $replayed,
        HostContext $host,
        CommandBus $commands,
    ): Response {
        $commands->run(new ReportEntryReplayedCommand($host->hostId, $entry, $replayed->runtimeId, $replayed->operationKey));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
