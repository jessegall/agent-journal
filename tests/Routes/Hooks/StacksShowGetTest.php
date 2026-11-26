<?php

declare(strict_types=1);

namespace Tests\Routes\Hooks;

use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A signed-in user inspects the hook stack of one agent's session: nothing is sent on.
 */
#[TestsRoute('GET', 'hooks.stacks.show')]
final class StacksShowGetTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Writer');

        return RouteCall::as(Caller::User)->parameters([
            'agentId' => $start->agent->id,
            'sessionId' => $start->session->id,
        ]);
    }
}
