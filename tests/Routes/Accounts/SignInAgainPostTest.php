<?php

declare(strict_types=1);

namespace Tests\Routes\Accounts;

use App\Commands\Accounts\BeginSignInAgain\BeginSignInAgainCommand;
use App\Values\SignInStarted;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner signs an account in again.
 */
#[TestsRoute('POST', 'accounts.sign-in-again')]
final class SignInAgainPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->user('Member');
        $accountId = strtolower((string) Str::ulid());

        return RouteCall::recorded('account-sign-in-again', [
            '01JPAGEREQUESTACCOUNT00000' => $accountId,
        ])
            ->reply(BeginSignInAgainCommand::class, new SignInStarted(strtolower((string) Str::ulid()), false))
            ->expects(BeginSignInAgainCommand::class, [
                'accountId' => $accountId,
            ])
            ->hiddenFrom('Member');
    }
}
