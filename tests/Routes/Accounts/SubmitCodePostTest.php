<?php

declare(strict_types=1);

namespace Tests\Routes\Accounts;

use App\Commands\Accounts\SubmitSignInCode\SubmitSignInCodeCommand;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsRoute;
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

        return RouteCall::recorded('account-sign-in-code', [
            '01JPAGEREQUESTATTEMPT00000' => $attemptId,
        ])
            ->expects(SubmitSignInCodeCommand::class, [
                'attemptId' => $attemptId,
                'code' => '123456',
                'submissionKey' => '00000000-0000-4000-8000-000000000001',
            ])
            ->hiddenFrom('Member');
    }
}
