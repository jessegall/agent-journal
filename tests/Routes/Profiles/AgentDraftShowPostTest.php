<?php

declare(strict_types=1);

namespace Tests\Routes\Profiles;

use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent reads a profile's shared script draft: nothing is sent on.
 */
#[TestsRoute('POST', 'profiles.agent.draft.show')]
final class AgentDraftShowPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Writer');

        return RouteCall::as(Caller::Agent, $start)->payload([
            'profile' => 'draft-test',
        ]);
    }
}
