<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use Tests\Support\Entries\Attributes\Generated;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Exceptions\EntryTestNeedsArrangement;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The entry test of GET agents.host.runtimes.tool-discovery, as the generator wrote it.
 */
#[Generated]
#[TestsRoute('GET', 'agents.host.runtimes.tool-discovery')]
final class HostRuntimesToolDiscoveryGetTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        throw EntryTestNeedsArrangement::for('GET agents.host.runtimes.tool-discovery', [
            '{runtime}',
        ]);
    }
}
