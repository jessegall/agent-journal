<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Agents\CancelSessionStart\CancelSessionStartCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner cancels the start of an agent's session.
 */
#[TestsRoute('POST', 'agents.cancel-start')]
final class CancelStartPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Main');
        $requestId = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::User)
            ->parameters([
                'agent' => $start->agent->id,
                'session' => $start->session->id,
            ])
            ->payload([
                'requestId' => $requestId,
            ])
            ->reply(CancelSessionStartCommand::class, true)
            ->expects(CancelSessionStartCommand::class, [
                'agentId' => $start->agent->id,
                'sessionId' => $start->session->id,
                'idempotencyKey' => $requestId,
            ]);
    }
}
