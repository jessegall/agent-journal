<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Drivers\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Enums\Drivers\RequestProgress;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host reports how far a driver request has got.
 */
#[TestsRoute('POST', 'agents.host.reports.request')]
final class HostReportsRequestPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)
            ->payload([
                'requestId' => 'request-1',
                'attempt' => 1,
                'actualBinding' => null,
                'progress' => 'accepted',
            ])
            ->expects(NotifyRequestProgressCommand::class, [
                'hostId' => $host->hostId,
                'requestId' => 'request-1',
                'attempt' => 1,
                'progress' => RequestProgress::Accepted,
            ]);
    }
}
