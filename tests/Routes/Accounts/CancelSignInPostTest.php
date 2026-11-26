<?php

declare(strict_types=1);

namespace Tests\Routes\Accounts;

use App\Accounts\Commands\CancelSignIn\CancelSignInCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner cancels a sign-in that is under way.
 */
#[TestsRoute('POST', 'accounts.cancel-sign-in')]
final class CancelSignInPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->user('Member');
        $attemptId = strtolower((string) Str::ulid());

        return RouteCall::recorded('account-sign-in-cancel', [
            '01JPAGEREQUESTATTEMPT00000' => $attemptId,
        ])
            ->expects(CancelSignInCommand::class, [
                'attemptId' => $attemptId,
            ])
            ->hiddenFrom('Member');
    }
}
