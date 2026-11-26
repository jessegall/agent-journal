<?php

declare(strict_types=1);

namespace Tests\Routes\Profiles;

use App\Commands\Accounts\TakeSignInCode\TakeSignInCodeCommand;
use App\Values\SignInPoll;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host takes the code the user typed for a sign-in, once.
 */
#[TestsRoute('POST', 'profiles.sign-in-host.code')]
final class SignInHostCodePostTest extends GuardedRouteEntryTestCase
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
                'generation' => 1,
            ])
            ->reply(TakeSignInCodeCommand::class, new SignInPoll(true, null))
            ->expects(TakeSignInCodeCommand::class, [
                'hostId' => $host->hostId,
                'attemptId' => $attemptId,
                'generation' => 1,
            ]);
    }
}
