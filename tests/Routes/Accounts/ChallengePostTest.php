<?php

declare(strict_types=1);

namespace Tests\Routes\Accounts;

use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner's page reads the address and code a running sign-in shows: nothing is sent on.
 */
#[TestsRoute('POST', 'accounts.challenge')]
final class ChallengePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->user('Member');

        return RouteCall::as(Caller::User)
            ->parameters([
                'attempt' => strtolower((string) Str::ulid()),
            ])
            ->hiddenFrom('Member');
    }
}
