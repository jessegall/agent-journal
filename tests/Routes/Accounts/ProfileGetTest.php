<?php

declare(strict_types=1);

namespace Tests\Routes\Accounts;

use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens one profile.
 */
#[TestsRoute('GET', 'accounts.profile')]
final class ProfileGetTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->user('Member')->installProfiles();

        return RouteCall::as(Caller::User)
            ->parameters([
                'profile' => 'main-agent',
            ])
            ->hiddenFrom('Member');
    }
}
