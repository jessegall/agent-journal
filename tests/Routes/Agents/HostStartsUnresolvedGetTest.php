<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host reads the starts it has not settled yet: nothing is sent on.
 */
#[TestsRoute('GET', 'agents.host.starts.unresolved')]
final class HostStartsUnresolvedGetTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        return RouteCall::as(Caller::SharedHost, $journal->owner()->enrolledHost());
    }
}
