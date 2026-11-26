<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\Commands\CommandRules\RecordEvidenceReads\RecordEvidenceReadsCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent reads the summary of a run's output, and the read is kept as evidence.
 */
#[TestsRoute('POST', 'processes.agent.output.summary')]
final class AgentOutputSummaryPostTest extends GuardedRouteEntryTestCase
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
            ->reply(RecordEvidenceReadsCommand::class, 1)
            ->expects(RecordEvidenceReadsCommand::class, [
                'processRunId' => $runId,
            ]);
    }
}
