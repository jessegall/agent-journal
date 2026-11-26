<?php

declare(strict_types=1);

namespace Tests\Routes\Profiles;

use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent reads the language profile scripts are written in: nothing is sent on.
 */
#[TestsRoute('POST', 'profiles.agent.language')]
final class AgentLanguagePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        return RouteCall::as(Caller::Agent, $journal->owner()->signedStart('Writer'));
    }
}
