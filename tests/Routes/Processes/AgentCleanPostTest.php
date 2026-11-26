<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\Commands\Runs\CleanProcessOutput\CleanProcessOutputCommand;
use App\Values\CleanPreview;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent previews what cleaning a run's output would remove.
 */
#[TestsRoute('POST', 'processes.agent.clean')]
final class AgentCleanPostTest extends GuardedRouteEntryTestCase
{
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $this->openAcmeRequest();
        $runId = $this->normalRun(0, self::PASSED_OUTPUT)->process_run_id;

        return RouteCall::as(Caller::Agent, $this->start)
            ->payload([
                'runs' => [
                    $runId,
                ],
                'isPreview' => true,
                'request_key' => 'clean-1',
            ])
            ->reply(CleanProcessOutputCommand::class, new CleanPreview([
                $runId,
            ], [], 0, false))
            ->expects(CleanProcessOutputCommand::class, [
                'runIds' => [
                    $runId,
                ],
                'isPreview' => true,
            ]);
    }
}
