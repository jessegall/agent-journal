<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\CommandRules\Commands\StartSample\StartSampleCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent starts the sample run the owner permitted.
 */
#[TestsRoute('POST', 'processes.agent.samples')]
final class AgentSamplesPostTest extends GuardedRouteEntryTestCase
{
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $this->openAcmeRequest();
        $permit = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::Agent, $this->start)
            ->parameters([
                'commandRequest' => $this->requestId,
            ])
            ->payload([
                'permit' => $permit,
                'request_key' => 'sample-1',
            ])
            ->reply(StartSampleCommand::class, strtolower((string) Str::ulid()))
            ->expects(StartSampleCommand::class, [
                'commandRequestId' => $this->requestId,
                'permitId' => $permit,
                'requestKey' => 'sample-1',
            ]);
    }
}
