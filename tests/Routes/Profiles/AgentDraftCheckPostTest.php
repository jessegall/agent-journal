<?php

declare(strict_types=1);

namespace Tests\Routes\Profiles;

use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent checks a profile script without saving it: nothing is sent on.
 */
#[TestsRoute('POST', 'profiles.agent.draft.check')]
final class AgentDraftCheckPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->signedStart('Writer');

        return RouteCall::as(Caller::Agent, $start)->payload([
            'profile' => 'draft-test',
            'source' => 'start',
        ]);
    }
}
