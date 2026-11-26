<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Drivers\NotifyStopped\NotifyStoppedCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host reports that a start stopped.
 */
#[TestsRoute('POST', 'agents.host.starts.stopped')]
final class HostStartsStoppedPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();
        $id = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::SharedHost, $host)
            ->parameters([
                'start' => $id,
            ])
            ->expects(NotifyStoppedCommand::class, [
                'hostId' => $host->hostId,
                'startKey' => $id,
            ]);
    }
}
