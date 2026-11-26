<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\Api\Processes\OutputTail;
use App\Commands\Runs\ReadOutputTail\ReadOutputTailCommand;
use App\Enums\Processes\OutputStream;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent reads the last lines of a run's output.
 */
#[TestsRoute('POST', 'processes.agent.output.tail')]
final class AgentOutputTailPostTest extends GuardedRouteEntryTestCase
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
                'part' => 1,
                'stream' => 'stdout',
                'lines' => 20,
            ])
            ->reply(ReadOutputTailCommand::class, new OutputTail('diagnostic output', 'stdout', 'passed', 0, 1))
            ->expects(ReadOutputTailCommand::class, [
                'processRunId' => $runId,
                'part' => 1,
                'stream' => OutputStream::Stdout,
                'lines' => 20,
            ]);
    }
}
