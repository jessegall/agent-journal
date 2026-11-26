<?php

declare(strict_types=1);

namespace Tests\Routes\Profiles;

use App\Accounts\Commands\ClaimSignIn\ClaimSignInCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host claims the next sign-in it is to run; with none waiting it is told so.
 */
#[TestsRoute('POST', 'profiles.sign-in-host.claim')]
final class SignInHostClaimPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();

        return RouteCall::as(Caller::SharedHost, $host)->expects(ClaimSignInCommand::class, [
            'hostId' => $host->hostId,
        ]);
    }
}
