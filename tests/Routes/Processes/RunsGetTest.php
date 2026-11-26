<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens the runs.
 */
#[TestsRoute('GET', 'processes.runs')]
final class RunsGetTest extends GuardedRouteEntryTestCase
{
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $this->openAcmeRequest();

        $journal->actAs('Owner');

        return RouteCall::as(Caller::User);
    }
}
