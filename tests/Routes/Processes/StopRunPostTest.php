<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\Processes\Commands\StopProcessRun\StopProcessRunCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner stops a run from its page.
 */
#[TestsRoute('POST', 'processes.stop-run')]
final class StopRunPostTest extends GuardedRouteEntryTestCase
{
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $this->openAcmeRequest();
        $runId = $this->normalRun(0, self::PASSED_OUTPUT)->process_run_id;

        $journal->actAs('Owner');

        return RouteCall::as(Caller::User)
            ->parameters([
                'run' => $runId,
            ])
            ->reply(StopProcessRunCommand::class, $runId)
            ->expects(StopProcessRunCommand::class, [
                'runId' => $runId,
                'reason' => 'stopped from the run page',
            ]);
    }
}
