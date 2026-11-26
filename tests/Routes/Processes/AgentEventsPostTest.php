<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\Models\Agents\Agent;
use App\Models\Runs\ProcessRun;
use App\Processes\Commands\RecordRunEvents\RecordRunEventsCommand;
use App\Support\ActorReference;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestRunAdmissions;

/**
 * The host reports the events of a run under the run's event key.
 */
#[TestsRoute('POST', 'processes.agent.events')]
final class AgentEventsPostTest extends GuardedRouteEntryTestCase
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
                'events' => [
                    [
                        'sequence' => 1,
                        'type' => 'part_queued',
                        'part' => [
                            'node' => 1,
                            'attempt' => 1,
                            'operation' => 'acme verify',
                        ],
                    ],
                ],
            ])
            ->reply(RecordRunEventsCommand::class, 1)
            ->expects(RecordRunEventsCommand::class, [
                'processRunId' => $run->id,
            ]);
    }
}
