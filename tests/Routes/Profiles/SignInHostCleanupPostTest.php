<?php

declare(strict_types=1);

namespace Tests\Routes\Profiles;

use App\Commands\Accounts\CleanSignInAttempt\CleanSignInAttemptCommand;
use App\Values\CleanupProgress;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The host reports what it removed while cleaning up a sign-in attempt.
 */
#[TestsRoute('POST', 'profiles.sign-in-host.cleanup')]
final class SignInHostCleanupPostTest extends GuardedRouteEntryTestCase
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
                'removed' => [],
                'store_removed' => true,
                'directory_removed' => true,
            ])
            ->reply(CleanSignInAttemptCommand::class, true)
            ->expects(CleanSignInAttemptCommand::class, [
                'hostId' => $host->hostId,
                'attemptId' => $attemptId,
                'progress' => new CleanupProgress(true, true),
            ]);
    }
}
