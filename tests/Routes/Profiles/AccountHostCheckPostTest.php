<?php

declare(strict_types=1);

namespace Tests\Routes\Profiles;

use App\Commands\Accounts\CheckAccount\CheckAccountCommand;
use App\Enums\Accounts\AccountCheckResult;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host reports what it found when it checked an account's sign-in.
 */
#[TestsRoute('POST', 'profiles.account-host.check')]
final class AccountHostCheckPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();
        $accountId = (string) Str::ulid();

        return RouteCall::as(Caller::SharedHost, $host)
            ->parameters([
                'account' => $accountId,
            ])
            ->payload([
                'generation' => 1,
                'result' => 'signed_in',
            ])
            ->expects(CheckAccountCommand::class, [
                'hostId' => $host->hostId,
                'accountId' => $accountId,
                'generation' => 1,
                'accountCheck' => AccountCheckResult::SignedIn,
            ]);
    }
}
