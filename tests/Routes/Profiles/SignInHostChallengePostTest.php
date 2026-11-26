<?php

declare(strict_types=1);

namespace Tests\Routes\Profiles;

use App\Commands\Accounts\PublishSignInChallenge\PublishSignInChallengeCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host publishes the address and code a sign-in asks the user to open.
 */
#[TestsRoute('POST', 'profiles.sign-in-host.challenge')]
final class SignInHostChallengePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $host = $journal->owner()->enrolledHost();
        $attemptId = (string) Str::ulid();

        return RouteCall::as(Caller::SharedHost, $host)
            ->parameters([
                'attempt' => $attemptId,
            ])
            ->payload([
                'address' => 'https://example.com/device',
                'code' => 'ABCD-1234',
            ])
            ->expects(PublishSignInChallengeCommand::class, [
                'hostId' => $host->hostId,
                'attemptId' => $attemptId,
                'address' => 'https://example.com/device',
                'code' => 'ABCD-1234',
            ]);
    }
}
