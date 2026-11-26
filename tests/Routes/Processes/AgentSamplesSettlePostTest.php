<?php

declare(strict_types=1);

namespace Tests\Routes\Processes;

use App\CommandRules\Commands\SettleSample\SettleSampleCommand;
use App\CommandRules\Enums\RequestStatus;
use App\CommandRules\Values\SampleOutcome;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent settles the sample it ran.
 */
#[TestsRoute('POST', 'processes.agent.samples.settle')]
final class AgentSamplesSettlePostTest extends GuardedRouteEntryTestCase
{
    use RunsAcmeRequests;

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $this->openAcmeRequest();
        $outcome = new SampleOutcome(RequestStatus::ReadyForSample, strtolower((string) Str::ulid()), []);

        return RouteCall::as(Caller::Agent, $this->start)
            ->parameters([
                'commandRequest' => $this->requestId,
            ])
            ->payload([
                'request_key' => 'settle-1',
            ])
            ->reply(SettleSampleCommand::class, $outcome)
            ->expects(SettleSampleCommand::class, [
                'commandRequestId' => $this->requestId,
            ]);
    }
}
