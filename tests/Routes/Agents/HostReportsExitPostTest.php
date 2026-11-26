<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Agents\NotifyRuntimeExit\NotifyRuntimeExitCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host reports that a runtime's process exited.
 */
#[TestsRoute('POST', 'agents.host.reports.exit')]
final class HostReportsExitPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)
            ->payload([
                'runtimeId' => 'runtime-1',
                'processGeneration' => 1,
                'evidence' => 'exit 0',
            ])
            ->expects(NotifyRuntimeExitCommand::class, [
                'hostId' => $host->hostId,
                'runtimeId' => 'runtime-1',
                'processGeneration' => 1,
                'evidence' => 'exit 0',
            ]);
    }
}
