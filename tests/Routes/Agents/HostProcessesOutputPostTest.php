<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Hosts\NotifyHostOutput\NotifyHostOutputCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host sends what one of its processes printed.
 */
#[TestsRoute('POST', 'agents.host.processes.output')]
final class HostProcessesOutputPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)
            ->parameters(['process' => 'process-1'])
            ->payload(['frames' => [], 'chunks' => []])
            ->expects(NotifyHostOutputCommand::class, [
                'hostId' => $host->hostId,
                'processId' => 'process-1',
            ]);
    }
}
