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
 * An agent searches a run's output for a text: nothing is sent on.
 */
#[TestsRoute('POST', 'processes.agent.output.search')]
final class AgentOutputSearchPostTest extends GuardedRouteEntryTestCase
{
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $this->openAcmeRequest();
        $runId = $this->normalRun(0, self::PASSED_OUTPUT)->process_run_id;

        return RouteCall::as(Caller::Agent, $this->start)
            ->parameters([
                'processRun' => $runId,
            ])
            ->payload([
                'text' => 'ok',
                'part' => 1,
                'stream' => 'stdout',
            ]);
    }
}
