<?php

declare(strict_types=1);

namespace Tests\Routes\Profiles;

use App\Accounts\Commands\CleanAccount\CleanAccountCommand;
use App\Accounts\Values\CleanupProgress;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host reports what it removed while cleaning up an account.
 */
#[TestsRoute('POST', 'profiles.account-host.cleanup')]
final class AccountHostCleanupPostTest extends GuardedRouteEntryTestCase
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
                'removed' => [],
                'store_removed' => true,
                'directory_removed' => true,
            ])
            ->reply(CleanAccountCommand::class, true)
            ->expects(CleanAccountCommand::class, [
                'hostId' => $host->hostId,
                'accountId' => $accountId,
                'generation' => 1,
                'progress' => new CleanupProgress(true, true),
            ]);
    }
}
