<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Agents\Commands\InterruptAgent\InterruptAgentCommand;
use App\Agents\Drivers\Enums\DriverOperation;
use App\Agents\Drivers\Enums\ExpectedTiming;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Values\DriverReceipt;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner interrupts what an agent's session is doing.
 */
#[TestsRoute('POST', 'agents.interrupt')]
final class InterruptPostTest extends GuardedRouteEntryTestCase
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
            ])
            ->reply(InterruptAgentCommand::class, new DriverReceipt(
                $requestId,
                1,
                DriverOperation::Interrupt,
                RequestProgress::Accepted,
                ExpectedTiming::ExpectedNow,
                null,
            ))
            ->expects(InterruptAgentCommand::class, [
                'agentId' => $start->agent->id,
                'sessionId' => $start->session->id,
                'idempotencyKey' => $requestId,
            ]);
    }
}
