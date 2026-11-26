<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\Commands\CommandRules\ApproveSample\ApproveSampleCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner permits a sample run of the command a request holds.
 */
#[TestsRoute('POST', 'processes.approve-sample')]
final class ApproveSamplePostTest extends GuardedRouteEntryTestCase
{
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $this->openAcmeRequest();
        $digest = $this->request()->source_digest;

        $journal->actAs('Owner');

        return RouteCall::as(Caller::User)
            ->parameters([
                'request' => $this->requestId,
            ])
            ->payload([
                'expected_revision' => 1,
                'command_digest' => $digest,
            ])
            ->reply(ApproveSampleCommand::class, strtolower((string) Str::ulid()))
            ->expects(ApproveSampleCommand::class, [
                'commandRequestId' => $this->requestId,
                'expectedRevision' => 1,
                'commandDigest' => $digest,
            ]);
    }
}
