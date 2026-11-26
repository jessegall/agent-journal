<?php

declare(strict_types=1);

namespace Tests\Routes\Accounts;

use App\Commands\Accounts\RetryAttemptCleanup\RetryAttemptCleanupCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner retries the cleanup of a sign-in attempt.
 */
#[TestsRoute('POST', 'accounts.retry-sign-in-cleanup')]
final class RetrySignInCleanupPostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->user('Member');
        $attemptId = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::User)
            ->parameters([
                'attempt' => $attemptId,
            ])
            ->expects(RetryAttemptCleanupCommand::class, [
                'attemptId' => $attemptId,
            ])
            ->hiddenFrom('Member');
    }
}
