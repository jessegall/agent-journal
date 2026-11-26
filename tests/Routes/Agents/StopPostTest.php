<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Agents\StopAgent\StopAgentCommand;
use App\Enums\Drivers\DriverOperation;
use App\Enums\Drivers\ExpectedTiming;
use App\Enums\Drivers\RequestProgress;
use App\Values\DriverReceipt;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner stops an agent's session at the generation the page showed.
 */
#[TestsRoute('POST', 'agents.stop')]
final class StopPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Main');
        $requestId = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::User)
            ->parameters([
                'agent' => $start->agent->id,
            ])
            ->payload([
                'requestId' => $requestId,
                'sessionId' => $start->session->id,
                'generation' => 0,
            ])
            ->reply(StopAgentCommand::class, new DriverReceipt(
                $requestId,
                1,
                DriverOperation::Stop,
                RequestProgress::Accepted,
                ExpectedTiming::ExpectedNow,
                null,
            ))
            ->expects(StopAgentCommand::class, [
                'agentId' => $start->agent->id,
                'sessionId' => $start->session->id,
                'idempotencyKey' => $requestId,
                'expectedGeneration' => 0,
            ]);
    }
}
