<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Agents\NotifyRuntimeHeartbeat\NotifyRuntimeHeartbeatCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host reports that a runtime's process is alive.
 */
#[TestsRoute('POST', 'agents.host.reports.heartbeat')]
final class HostReportsHeartbeatPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)
            ->payload([
                'runtimeId' => 'runtime-1',
                'processGeneration' => 1,
                'evidence' => 'pid 42',
            ])
            ->expects(NotifyRuntimeHeartbeatCommand::class, [
                'hostId' => $host->hostId,
                'runtimeId' => 'runtime-1',
                'processGeneration' => 1,
                'evidence' => 'pid 42',
            ]);
    }
}
