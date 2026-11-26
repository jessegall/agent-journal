<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Projects\RecordHostProtection\RecordHostProtectionCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host reports how it protects a driver's files.
 */
#[TestsRoute('POST', 'agents.host.reports.protection')]
final class HostReportsProtectionPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)
            ->payload([
                'driver' => 'claude-code',
                'build' => '2.1.323',
                'platform' => 'linux-container',
                'items' => [
                    [
                        'item' => 'settings',
                        'isEnforced' => true,
                        'evidence' => 'run-1',
                        'reason' => '',
                    ],
                ],
            ])
            ->expects(RecordHostProtectionCommand::class, [
                'hostId' => $host->hostId,
            ]);
    }
}
