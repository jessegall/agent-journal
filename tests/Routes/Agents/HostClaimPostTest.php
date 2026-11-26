<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Drivers\ClaimDriverRequests\ClaimDriverRequestsCommand;
use App\Commands\Projects\ClaimProjectReads\ClaimProjectReadsCommand;
use App\Support\ClaimedRequests;
use App\Values\ProjectReadClaims;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host claims the driver requests and project reads waiting for it.
 */
#[TestsRoute('POST', 'agents.host.claim')]
final class HostClaimPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)
            ->payload([
                'watched_version' => 0,
            ])
            ->reply(ClaimDriverRequestsCommand::class, new ClaimedRequests([]))
            ->expects(ClaimDriverRequestsCommand::class, [
                'hostId' => $host->hostId,
            ])
            ->reply(ClaimProjectReadsCommand::class, new ProjectReadClaims([]))
            ->expects(ClaimProjectReadsCommand::class, [
                'hostId' => $host->hostId,
            ]);
    }
}
