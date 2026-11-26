<?php

declare(strict_types=1);

namespace Tests\Routes\Accounts;

use App\Commands\Accounts\RemoveAccount\RemoveAccountCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner removes an account.
 */
#[TestsRoute('DELETE', 'accounts.remove')]
final class RemoveDeleteTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->user('Member');
        $accountId = strtolower((string) Str::ulid());

        return RouteCall::recorded('account-remove', [
            '01JPAGEREQUESTACCOUNT00000' => $accountId,
        ])
            ->expects(RemoveAccountCommand::class, [
                'accountId' => $accountId,
            ])
            ->hiddenFrom('Member');
    }
}
