<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Commands\Agents\RecordHeartbeat\RecordHeartbeatCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent's session says it is still there.
 */
#[TestsRoute('POST', 'agents.agent.heartbeat')]
final class AgentHeartbeatPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Main');

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'request_key' => 'heartbeat-1',
            ])
            ->expects(RecordHeartbeatCommand::class, [
                'sessionId' => $start->session->id,
            ]);
    }
}
