<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\Processes\Commands\CleanProcessOutput\CleanProcessOutputCommand;
use App\Processes\Values\CleanPreview;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner cleans the output of one run.
 */
#[TestsRoute('POST', 'processes.clean-run')]
final class CleanRunPostTest extends GuardedRouteEntryTestCase
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
            ->reply(CleanProcessOutputCommand::class, new CleanPreview([
                $runId,
            ], [], 0, true))
            ->expects(CleanProcessOutputCommand::class, [
                'runIds' => [
                    $runId,
                ],
                'isPreview' => false,
            ]);
    }
}
