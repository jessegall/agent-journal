<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Projects\RecordHostDescriptors\RecordHostDescriptorsCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host reports the drivers it can run.
 */
#[TestsRoute('POST', 'agents.host.reports.descriptors')]
final class HostReportsDescriptorsPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)
            ->payload([
                'descriptors' => [
                    [
                        'key' => 'claude-code',
                        'build' => '2.1.323',
                        'arrangement' => 'local',
                        'placement' => 'protected_host',
                    ],
                ],
            ])
            ->expects(RecordHostDescriptorsCommand::class, [
                'hostId' => $host->hostId,
            ]);
    }
}
