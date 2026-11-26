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
 * The host fetches the admission of a run it is to start: nothing is sent on.
 */
#[TestsRoute('POST', 'processes.agent.admission')]
final class AgentAdmissionPostTest extends GuardedRouteEntryTestCase
{
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        config([
            'processes.runner' => true,
        ]);
        $journal->owner();
        $this->openAcmeRequest();
        $run = ProcessRun::create(
            ActorReference::ofClass(Agent::class, $this->start->agent->id),
            TestRunAdmissions::of(),
        );

        return RouteCall::as(Caller::Agent, $this->start)
            ->parameters([
                'processRun' => $run->id,
            ])
            ->payload([
                'request_key' => 'admit-1',
            ]);
    }
}
