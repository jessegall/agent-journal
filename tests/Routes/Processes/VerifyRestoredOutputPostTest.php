<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\Commands\Runs\VerifyRestoredOutput\VerifyRestoredOutputCommand;
use App\Values\RestoredCaptures;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner checks a run's output against its original checksums after it was restored to the disk.
 */
#[TestsRoute('POST', 'processes.verify-restored-output')]
final class VerifyRestoredOutputPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $runId = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::User)
            ->parameters([
                'run' => $runId,
            ])
            ->reply(VerifyRestoredOutputCommand::class, new RestoredCaptures([]))
            ->expects(VerifyRestoredOutputCommand::class, [
                'runId' => $runId,
            ]);
    }
}
