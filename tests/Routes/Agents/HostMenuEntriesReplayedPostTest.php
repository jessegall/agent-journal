<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Drivers\NotifyEntryReplayed\NotifyEntryReplayedCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host reports that it replayed a menu entry on a runtime.
 */
#[TestsRoute('POST', 'agents.host.menu-entries.replayed')]
final class HostMenuEntriesReplayedPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();
        $id = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::SharedHost, $host)
            ->parameters([
                'entry' => $id,
            ])
            ->payload([
                'runtimeId' => 'runtime-1',
                'operationKey' => 'operation-1',
            ])
            ->expects(NotifyEntryReplayedCommand::class, [
                'hostId' => $host->hostId,
                'entryId' => $id,
                'runtimeId' => 'runtime-1',
                'operationKey' => 'operation-1',
            ]);
    }
}
