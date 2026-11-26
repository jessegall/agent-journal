<?php

declare(strict_types=1);

namespace Tests\Routes\Accounts;

use App\Commands\Accounts\SubmitSignInCode\SubmitSignInCodeCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * The owner types the code a sign-in asks for.
 */
#[TestsRoute('POST', 'accounts.submit-code')]
final class SubmitCodePostTest extends GuardedRouteEntryTestCase
{
    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner()->user('Member');
        $attemptId = strtolower((string) Str::ulid());

        return RouteCall::as(Caller::User)
            ->parameters([
                'attempt' => $attemptId,
            ])
            ->payload([
                'code' => '123456',
                'submission_key' => 'code-1',
            ])
            ->expects(SubmitSignInCodeCommand::class, [
                'attemptId' => $attemptId,
                'code' => '123456',
                'submissionKey' => 'code-1',
            ])
            ->hiddenFrom('Member');
    }
}
