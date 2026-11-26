<?php

declare(strict_types=1);

namespace Tests\Routes\Scripts;

use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner checks a script in the profile's editor: the answer holds the checked draft and nothing is sent on.
 */
#[TestsRoute('POST', 'scripts.check-draft')]
final class CheckDraftPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->user('Member');

        return RouteCall::as(Caller::User)
            ->parameters([
                'profile' => 'draft-test',
            ])
            ->payload([
                'profile' => 'draft-test',
                'source' => 'start',
            ])
            ->hiddenFrom('Member');
    }
}
