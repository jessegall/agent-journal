<?php

declare(strict_types=1);

namespace Tests\Routes\Agents;

use App\Agents\Commands\RetireAgent\RetireAgentCommand;
use App\Support\AssignmentResult;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A main agent retires one of its helpers, which gives back what it held.
 */
#[TestsRoute('POST', 'agents.agent.retire')]
final class AgentRetirePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Main');
        $helper = $journal->signedStart('Helper');

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'agentId' => $helper->agent->id,
                'request_key' => 'retire-1',
            ])
            ->reply(RetireAgentCommand::class, new AssignmentResult([], []))
            ->expects(RetireAgentCommand::class, [
                'agentId' => $helper->agent->id,
            ]);
    }
}
