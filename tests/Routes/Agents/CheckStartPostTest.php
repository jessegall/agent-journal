<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Agents\CheckStartStatus\CheckStartStatusCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner asks how the start of an agent's session stands.
 */
#[TestsRoute('POST', 'agents.check-start')]
final class CheckStartPostTest extends GuardedRouteEntryTestCase
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
            ->reply(CheckStartStatusCommand::class, true)
            ->expects(CheckStartStatusCommand::class, [
                'agentId' => $start->agent->id,
                'sessionId' => $start->session->id,
                'idempotencyKey' => $requestId,
            ]);
    }
}
