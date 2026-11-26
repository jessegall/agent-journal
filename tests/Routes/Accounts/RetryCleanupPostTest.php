<?php

declare(strict_types=1);

namespace Tests\Routes\Accounts;

use App\Accounts\Commands\RetryAccountCleanup\RetryAccountCleanupCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner retries the cleanup of a removed account.
 */
#[TestsRoute('POST', 'accounts.retry-cleanup')]
final class RetryCleanupPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->user('Member');
        $accountId = strtolower((string) Str::ulid());

        return RouteCall::recorded('account-retry-cleanup', [
            '01JPAGEREQUESTACCOUNT00000' => $accountId,
        ])
            ->expects(RetryAccountCleanupCommand::class, [
                'accountId' => $accountId,
            ])
            ->hiddenFrom('Member');
    }
}
