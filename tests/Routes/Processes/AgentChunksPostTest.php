<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\Models\Agents\Agent;
use App\Models\Runs\ProcessRun;
use App\Processes\Commands\RecordRunChunk\RecordRunChunkCommand;
use App\Processes\Enums\OutputStream;
use App\Support\ActorReference;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TestRunAdmissions;

/**
 * The host stores a chunk of a run's output under the run's event key.
 */
#[TestsRoute('POST', 'processes.agent.chunks')]
final class AgentChunksPostTest extends GuardedRouteEntryTestCase
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
                'chunk' => [
                    'part' => [
                        'node' => 1,
                        'attempt' => 1,
                        'operation' => 'acme verify',
                    ],
                    'stream' => 'stdout',
                    'offset' => 0,
                    'bytes' => 'hello',
                ],
            ])
            ->reply(RecordRunChunkCommand::class, 5)
            ->expects(RecordRunChunkCommand::class, [
                'processRunId' => $run->id,
                'node' => 1,
                'attempt' => 1,
                'operation' => 'acme verify',
                'stream' => OutputStream::Stdout,
                'offset' => 0,
                'bytes' => 'hello',
            ]);
    }
}
