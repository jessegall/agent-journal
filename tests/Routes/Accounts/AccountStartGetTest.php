<?php

declare(strict_types=1);

namespace Tests\Routes\Accounts;

use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner opens the start of an agent's session on an account.
 */
#[TestsRoute('GET', 'accounts.account-start')]
final class AccountStartGetTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $start = $journal->owner()->user('Member')->signedStart('Main');

        return RouteCall::as(Caller::User)
            ->parameters([
                'session' => $start->session->id,
            ])
            ->hiddenFrom('Member');
    }
}
