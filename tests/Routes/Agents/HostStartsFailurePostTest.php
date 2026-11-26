<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Agents\NotifyFailure\NotifyFailureCommand;
use App\Enums\Drivers\DriverFailure;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host reports that a start failed, and why.
 */
#[TestsRoute('POST', 'agents.host.starts.failure')]
final class HostStartsFailurePostTest extends GuardedRouteEntryTestCase
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
                'failure' => 'rate_limit',
            ])
            ->expects(NotifyFailureCommand::class, [
                'hostId' => $host->hostId,
                'startKey' => $id,
                'failure' => DriverFailure::RateLimit,
            ]);
    }
}
