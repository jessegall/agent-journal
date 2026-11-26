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
    public function test_a_refused_answer_flashes_no_code_into_the_session(): void
    {
        $this->journal->owner()->sinkCommands();

        $this->journal->route(
            'POST',
            'accounts.submit-code',
            ['attempt' => strtolower((string) Str::ulid())],
            payload: ['code' => 'secret code with spaces'],
        )
            ->assertSessionHasErrors('submission_key')
            ->assertSessionMissing('_old_input.code');
        $this->journal->assertNothingDispatched();
    }

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
