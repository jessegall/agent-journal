<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\Models\Agents\Agent;
use App\Models\Runs\ProcessRun;
use App\Support\ActorReference;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestRunAdmissions;

/**
 * The host asks whether a run went stale under the run's event key: nothing is sent on.
 */
#[TestsRoute('POST', 'processes.agent.staleness')]
final class AgentStalenessPostTest extends GuardedRouteEntryTestCase
{
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $this->openAcmeRequest();
        $run = ProcessRun::create(
            ActorReference::ofClass(Agent::class, $this->start->agent->id),
            TestRunAdmissions::of(),
        );
        $eventKey = (string) $run->consumeFor('admit-1', 'test-app-key');

        return RouteCall::as(Caller::Agent, $this->start)
            ->parameters([
                'processRun' => $run->id,
            ])
            ->payload([
                'key' => $eventKey,
            ]);
    }
}
