<?php

declare(strict_types=1);

namespace Tests\Machinery\Seeding;

use App\Accounts\Enums\SignInStatus;
use App\Accounts\Exceptions\SignInAnswerRefused;
use Tests\Support\Assertions\Assert;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\Exceptions\FixtureRefused;
use Tests\Support\Seeding\TestJournal;
use Tests\TestCase;

/**
 * The owner's sign-ins a test begins are called by the names the test gave them, and the journal's facts read each by
 * that name; a second sign-in under a name in use is refused.
 */
#[TestsMachinery(TestJournal::class)]
final class JournalSignInsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_sign_in_the_owner_opens_is_called_by_its_name_and_starts(): void
    {
        $this->journal->owner()
            ->beginSignIn('claude', 'claude-code')
            ->assertJournal(fn (Assert $journal) => $journal
                ->where('signIns.claude.status', SignInStatus::Starting)
                ->missing('signIns.claude.challenge'))
            ->assertResult(true, $this->journal->signInCalled('claude') !== '');
    }

    public function test_a_sign_in_again_of_a_saved_account_is_called_by_its_own_name(): void
    {
        $this->journal->owner()->chooseActiveAccounts();

        $this->journal
            ->beginSignInAgain('again', $this->journal->chosenAccounts()['claude-code'])
            ->assertJournal(fn (Assert $journal) => $journal->has('signIns.again'))
            ->assertRefused(FixtureRefused::class, fn (TestJournal $journal) => $journal
                ->beginSignIn('again', 'codex'));
    }

    public function test_a_code_for_a_sign_in_that_waits_for_none_is_refused(): void
    {
        $this->journal->owner()->beginSignIn('claude', 'claude-code')->assertRefused(
            SignInAnswerRefused::class,
            fn (TestJournal $journal) => $journal->submitSignInCode('claude', 'code', 'code-1'),
        );
    }
}
