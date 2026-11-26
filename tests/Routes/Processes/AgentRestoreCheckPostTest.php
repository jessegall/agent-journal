<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\Commands\Runs\VerifyRestoredOutput\VerifyRestoredOutputCommand;
use App\Values\RestoredCaptures;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent checks that a run's restored output is whole.
 */
#[TestsRoute('POST', 'processes.agent.restore-check')]
final class AgentRestoreCheckPostTest extends GuardedRouteEntryTestCase
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
                'request_key' => 'restore-check-1',
            ])
            ->reply(VerifyRestoredOutputCommand::class, new RestoredCaptures([]))
            ->expects(VerifyRestoredOutputCommand::class, [
                'runId' => $runId,
            ]);
    }
}
