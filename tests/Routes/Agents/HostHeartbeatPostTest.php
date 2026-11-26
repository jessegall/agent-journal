<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Hosts\NotifyHostHeartbeat\NotifyHostHeartbeatCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A host says it is alive.
 */
#[TestsRoute('POST', 'agents.host.heartbeat')]
final class HostHeartbeatPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)
            ->payload(['live_processes' => ['process-1'], 'answered_through' => 'order-1'])
            ->expects(NotifyHostHeartbeatCommand::class, [
                'hostId' => $host->hostId,
                'liveProcesses' => ['process-1'],
                'answeredThrough' => 'order-1',
            ]);
    }
}
