<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Agents\NotifyRunning\NotifyRunningCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host reports that a start is running.
 */
#[TestsRoute('POST', 'agents.host.starts.running')]
final class HostStartsRunningPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();
        $id = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::SharedHost, $host)
            ->parameters([
                'start' => $id,
            ])
            ->payload([
                'execution_id' => 'execution-1',
            ])
            ->expects(NotifyRunningCommand::class, [
                'hostId' => $host->hostId,
                'startKey' => $id,
                'executionId' => 'execution-1',
            ]);
    }
}
