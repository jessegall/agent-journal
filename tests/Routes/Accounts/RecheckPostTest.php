<?php

declare(strict_types=1);

namespace Tests\Routes\Accounts;

use App\Commands\Accounts\RecheckAccount\RecheckAccountCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner asks the host to check an account's sign-in again.
 */
#[TestsRoute('POST', 'accounts.recheck')]
final class RecheckPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->user('Member');
        $accountId = strtolower((string) Str::ulid());

        return RouteCall::recorded('account-recheck', [
            '01JPAGEREQUESTACCOUNT00000' => $accountId,
        ])
            ->expects(RecheckAccountCommand::class, [
                'accountId' => $accountId,
            ])
            ->hiddenFrom('Member');
    }
}
