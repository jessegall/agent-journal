<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Agents\NotifyRuntimeScreen\NotifyRuntimeScreenCommand;
use App\Support\ScreenReportAnswer;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host reports what a runtime's screen shows.
 */
#[TestsRoute('POST', 'agents.host.reports.screen')]
final class HostReportsScreenPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)
            ->payload([
                'runtimeId' => 'runtime-1',
            ])
            ->reply(NotifyRuntimeScreenCommand::class, ScreenReportAnswer::stored())
            ->expects(NotifyRuntimeScreenCommand::class, [
                'hostId' => $host->hostId,
            ]);
    }
}
