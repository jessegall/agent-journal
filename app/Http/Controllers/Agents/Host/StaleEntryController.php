<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Commands\Navigation\MarkMenuEntryStale\MarkMenuEntryStaleCommand;
use App\Contracts\Bus\CommandBus;
use App\Data\Agents\MenuEntryStaleData;
use App\Values\HostContext;
use Illuminate\Http\Response;

/**
 * Takes the host's report that a library entry's replay failed on a build. The host's calls run as the journal itself,
 * never an actor.
 */
final readonly class StaleEntryController
{
    public function __invoke(
        string $entry,
        MenuEntryStaleData $stale,
        HostContext $host,
        CommandBus $commands,
    ): Response {
        $commands->run(new MarkMenuEntryStaleCommand(
            $host->hostId,
            $entry,
            $stale->runtimeId,
            $stale->reason,
            $stale->step,
            $stale->build,
            $stale->rows,
        ));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
