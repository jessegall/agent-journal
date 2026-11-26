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
 * An approval of a sample run sent through the agent API names the command it permits.
 */
#[TestsRoute('POST', 'processes.agent.sample-approval')]
final class AgentSampleApprovalPostTest extends GuardedRouteEntryTestCase
{
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $this->openAcmeRequest();
        $digest = $this->request()->source_digest;

        return RouteCall::as(Caller::Agent, $this->start)
            ->parameters([
                'commandRequest' => $this->requestId,
            ])
            ->payload([
                'expected_revision' => 1,
                'command_digest' => $digest,
                'request_key' => 'approve-sample-1',
            ])
            ->reply(ApproveSampleCommand::class, strtolower((string) Str::ulid()))
            ->expects(ApproveSampleCommand::class, [
                'commandRequestId' => $this->requestId,
                'expectedRevision' => 1,
                'commandDigest' => $digest,
            ]);
    }
}
