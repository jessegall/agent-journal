<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Hosts\ClaimHostOrders\ClaimHostOrdersCommand;
use App\Values\HostOrderClaim;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host's long poll takes the orders waiting for it.
 */
#[TestsRoute('POST', 'agents.host.orders.claim')]
final class HostOrdersClaimPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)
            ->payload(['limit' => 5, 'wait' => 0])
            ->reply(ClaimHostOrdersCommand::class, new HostOrderClaim([], '2026-11-26T10:00:00.000Z', null, 600))
            ->expects(ClaimHostOrdersCommand::class, ['hostId' => $host->hostId, 'limit' => 5]);
    }
}
