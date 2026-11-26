<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Hosts\NotifyHostOrder\NotifyHostOrderCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host answers an order it claimed.
 */
#[TestsRoute('POST', 'agents.host.orders.answer')]
final class HostOrdersAnswerPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)
            ->parameters(['order' => 'order-1'])
            ->payload(['order_id' => 'order-1', 'status' => 'done'])
            ->expects(NotifyHostOrderCommand::class, [
                'hostId' => $host->hostId,
                'orderId' => 'order-1',
            ]);
    }
}
