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
 * The owner retires an agent, which gives back what it held.
 */
#[TestsRoute('POST', 'agents.retire')]
final class RetirePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Main');

        return RouteCall::as(Caller::User)
            ->payload([
                'agentId' => $start->agent->id,
            ])
            ->reply(RetireAgentCommand::class, new AssignmentResult([], []))
            ->expects(RetireAgentCommand::class, [
                'agentId' => $start->agent->id,
            ]);
    }
}
