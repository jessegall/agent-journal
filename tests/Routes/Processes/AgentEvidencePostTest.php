<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\Commands\CommandRules\ApproveSample\ApproveSampleCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestIds;

/**
 * An agent starts the evidence run the owner permitted: nothing is sent on.
 */
#[TestsRoute('POST', 'processes.agent.evidence')]
final class AgentEvidencePostTest extends GuardedRouteEntryTestCase
{
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $this->openAcmeRequest();
        $permit = $journal->actAsUserId(TestIds::of(7))->runUnkeyed(
            new ApproveSampleCommand($this->requestId, 1, $this->request()->source_digest),
        );

        return RouteCall::as(Caller::Agent, $this->start)
            ->parameters([
                'evidencePermit' => $permit,
            ])
            ->payload([
                'request_key' => 'evidence-1',
            ]);
    }
}
