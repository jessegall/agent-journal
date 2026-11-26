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
 * An agent reads its command request: nothing is sent on.
 */
#[TestsRoute('POST', 'processes.agent.requests.show')]
final class AgentRequestsShowPostTest extends GuardedRouteEntryTestCase
{
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $this->openAcmeRequest();

        return RouteCall::as(Caller::Agent, $this->start)
            ->parameters([
                'commandRequest' => $this->requestId,
            ]);
    }
}
