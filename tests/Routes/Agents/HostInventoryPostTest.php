<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Hosts\Commands\NotifyHostInventory\NotifyHostInventoryCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A host that started reports what it holds.
 */
#[TestsRoute('POST', 'agents.host.inventory')]
final class HostInventoryPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)
            ->payload(['protocol' => 1, 'release' => '6.0.0', 'capabilities' => [], 'processes' => []])
            ->expects(NotifyHostInventoryCommand::class, ['hostId' => $host->hostId]);
    }
}
