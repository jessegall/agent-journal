<?php

declare(strict_types=1);

namespace Tests\Routes\Scripts;

use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A signed-in user checks a profile script without saving it: nothing is sent on.
 */
#[TestsRoute('POST', 'scripts.draft.check')]
final class DraftCheckPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();

        return RouteCall::as(Caller::User)->payload([
            'profile' => 'draft-test',
            'source' => 'start',
        ]);
    }
}
