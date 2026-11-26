<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\Seeding\TestJournal;

/**
 * The host asks whether a runtime's tools were discovered in its current generation: nothing is sent on.
 */
#[TestsRoute('GET', 'agents.host.runtimes.tool-discovery')]
final class HostRuntimesToolDiscoveryGetTest extends GuardedRouteEntryTestCase
{
    use OpensTerminalRuntimes;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();
        $runtime = $this->runtimeOn($host->hostId);

        return RouteCall::as(Caller::SharedHost, $host)
            ->parameters([
                'runtime' => $runtime->id,
            ]);
    }
}
