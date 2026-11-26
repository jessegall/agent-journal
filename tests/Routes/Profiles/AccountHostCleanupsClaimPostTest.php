<?php

declare(strict_types=1);

namespace Tests\Routes\Profiles;

use App\Accounts\Commands\ClaimCleanup\ClaimCleanupCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host claims the next cleanup it is to run; with none waiting it is told so.
 */
#[TestsRoute('POST', 'profiles.account-host.cleanups.claim')]
final class AccountHostCleanupsClaimPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)->expects(ClaimCleanupCommand::class, [
            'hostId' => $host->hostId,
        ]);
    }
}
