<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Hosts\Commands\NotifyHostProcess\NotifyHostProcessCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host reports that one of its processes runs.
 */
#[TestsRoute('POST', 'agents.host.processes.report')]
final class HostProcessesReportPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)
            ->parameters(['process' => 'process-1'])
            ->payload(['process_id' => 'process-1', 'report' => 'running', 'identity' => 'pid:1', 'generation' => 0])
            ->expects(NotifyHostProcessCommand::class, [
                'hostId' => $host->hostId,
                'processId' => 'process-1',
            ]);
    }
}
