<?php

declare(strict_types=1);

namespace Tests\Routes\Scripts;

use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A signed-in user reads the language profile scripts are written in: nothing is sent on.
 */
#[TestsRoute('POST', 'scripts.language')]
final class LanguagePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::as(Caller::User);
    }
}
