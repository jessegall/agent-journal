<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\BeginSignIn\BeginSignInCommand;
use App\Commands\Accounts\BeginSignInAgain\BeginSignInAgainCommand;
use App\Commands\Accounts\CancelSignIn\CancelSignInCommand;
use App\Commands\Accounts\CompleteSignIn\CompleteSignInCommand;
use App\Commands\Accounts\SubmitSignInCode\SubmitSignInCodeCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Data\Accounts\SignInAttemptData;
use App\Enums\Accounts\AccountStatus;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Accounts\SignInMethod;
use App\Enums\Accounts\SignInStatus;
use App\Events\Accounts\AccountsChanged;
use App\Exceptions\SignInAttemptStale;
use App\Jobs\SignInDeadline;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Models\Accounts\SignInAttempt;
use App\Support\Access\AccessSettings;
use App\Support\ActorReference;
use App\Support\DefaultDrivers;
use App\Support\JournalCommands;
use App\Values\SignInIdentity;
use App\Values\SignInStarted;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A host completes a sign-in with its verified report: the first account is made and chosen once, the same report
 * twice publishes once while an older generation is refused, a new account is named from its identity, an attempt names
 * the account it made, renewed or matched, a login named only by email is a new row, a starter that lost its grant adds
 * no account, and a cancelled attempt ignores a late result.
 */
#[TimeLimit(seconds: 3, reason: 'It commits attempts and accounts through the bus and empties five tables per test.')]
#[TestsCommand(CompleteSignInCommand::class)]
final class CompleteSignInTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

    private const array TABLES = [
        'users',
        'accounts',
        'active_accounts',
        'sign_in_attempts',
        'command_receipts',
        'links',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();

        Bus::fake([SignInDeadline::class]);
        $this->journal->actAs('Owner');
    }

    public function test_a_verified_sign_in_makes_the_first_account_and_chooses_it_once(): void
    {
        $started = $this->begin('request-1');
        SignInAttempt::query()->whereKey($started->attemptId)->sole()->waitForUser();

        $this->complete($started->attemptId, 0, 'work@example.test');

        $account = Account::query()->sole();
        $this->assertSame([AccountStatus::Authenticated, 'work@example.test'], [$account->status, $account->label]);
        $this->assertSame($account->id, ActiveAccount::query()->sole()->account_id);
        $this->assertSame(SignInStatus::Complete, SignInAttempt::query()->sole()->status);
    }

    public function test_the_same_verified_report_twice_publishes_once_and_an_older_generation_is_refused(): void
    {
        $started = $this->begin('request-1');
        SignInAttempt::query()->whereKey($started->attemptId)->sole()->waitForUser();
        $this->complete($started->attemptId, 0, 'work@example.test');
        Event::fake([AccountsChanged::class]);

        $this->complete($started->attemptId, 0, 'work@example.test');

        $this->assertSame(1, Account::query()->count());
        Event::assertNotDispatched(AccountsChanged::class);
        $this->expectException(SignInAttemptStale::class);
        $this->complete($started->attemptId, 1, 'work@example.test');
    }

    public function test_a_new_account_is_named_from_its_identity_and_a_known_principal_is_already_added(): void
    {
        $this->completeNew('request-1', new SignInIdentity('a@example.test', 'subject-1', null));
        $this->completeNew('request-2', new SignInIdentity('a@example.test', 'subject-2', null));
        $this->completeNew('request-3', SignInIdentity::unproved());
        $known = $this->completeNew('request-4', new SignInIdentity('a@example.test', 'subject-1', null));

        $labels = Account::query()->orderBy('created_at')->pluck('label')->all();
        $this->assertSame(['a@example.test', 'a@example.test (2)', 'Claude Code'], $labels);
        $this->assertSame(SignInStatus::AlreadyAdded, SignInAttempt::query()->whereKey($known)->sole()->status);
        $first = Account::query()->orderBy('created_at')->firstOrFail();
        $this->assertSame($first->id, ActiveAccount::query()->sole()->account_id);
    }

    public function test_an_attempt_names_the_account_it_made_renewed_or_matched_apart_from_its_target(): void
    {
        $added = $this->completeNew('request-1', new SignInIdentity('a@example.test', 'subject-1', null));
        $account = Account::query()->sole();
        $matched = $this->completeNew('request-2', new SignInIdentity('a@example.test', 'subject-1', null));
        $again = $this->journal->run(new BeginSignInAgainCommand($account->id), 'request-3');
        $renewal = SignInAttempt::query()->whereKey($again->attemptId)->sole();
        $renewal->waitForUser();

        $this->app->make(JournalCommands::class)->runAsJournal(
            CommandEntry::HostControl,
            'test host',
            new CompleteSignInCommand(
                $again->attemptId,
                $renewal->generation,
                new SignInIdentity('a@example.test', 'subject-1', null),
            ),
        );

        $this->journal->actAs('Owner');

        $this->assertSame([null, $account->id], $this->targetAndResultOf($added));
        $this->assertSame([null, $account->id], $this->targetAndResultOf($matched));
        $this->assertSame([$account->id, $account->id], $this->targetAndResultOf($again->attemptId));

        $this->app->make(CurrentActorSetter::class)->clear();
        $this->assertSame([null, null], $this->targetAndResultOf($added));
    }

    public function test_a_login_named_only_by_email_is_a_new_row(): void
    {
        $this->completeNew('request-1', SignInIdentity::shown('same@example.test'));
        $second = $this->completeNew('request-2', SignInIdentity::shown('same@example.test'));

        $this->assertSame(2, Account::query()->count());
        $this->assertSame(SignInStatus::Complete, SignInAttempt::query()->whereKey($second)->sole()->status);
    }

    public function test_a_starter_that_lost_its_grant_before_the_report_adds_no_account(): void
    {
        $started = $this->begin('request-1');
        SignInAttempt::query()->whereKey($started->attemptId)->sole()->waitForUser();
        $this->app->instance(AccessSettings::class, new AccessSettings(TestIds::of(2)));

        $this->complete($started->attemptId, 0, 'work@example.test');

        $this->assertSame(0, Account::query()->count());
        $this->assertSame(SignInStatus::Failed, SignInAttempt::query()->sole()->status);
    }

    public function test_a_cancelled_attempt_ignores_a_late_result_and_owes_its_folder_cleanup(): void
    {
        $started = $this->begin('request-1');

        $this->bus()->run(new CancelSignInCommand($started->attemptId));

        $attempt = SignInAttempt::query()->sole();
        $this->assertSame(SignInStatus::Cancelled, $attempt->status);
        $this->assertTrue($attempt->cleanup_pending);
        $this->expectException(SignInAttemptStale::class);

        $this->complete($started->attemptId, 0, null);
    }

    public function test_key_accounts_are_named_for_their_method_and_the_same_key_is_already_added(): void
    {

        $first = $this->verifiedKey('request-1', 'key-1');
        $again = $this->verifiedKey('request-2', 'key-1');
        $this->verifiedKey('request-3', 'key-2');

        $labels = Account::query()->orderBy('created_at')->orderBy('id')->pluck('label')->all();
        $this->assertSame(['Claude Code API key', 'Claude Code API key (2)'], $labels);
        $this->assertSame(SignInStatus::AlreadyAdded, $again->refresh()->status);
        $this->assertSame(SignInStatus::Complete, $first->refresh()->status);
    }

    private function begin(string $requestKey): SignInStarted
    {
        return $this->journal->run(new BeginSignInCommand('claude-code', SignInMethod::OAuth), $requestKey);
    }

    /**
     * A new account's sign-in, started and verified with this identity; answers its attempt.
     */
    private function completeNew(string $requestKey, SignInIdentity $identity): string
    {
        $started = $this->begin($requestKey);
        SignInAttempt::query()->whereKey($started->attemptId)->sole()->waitForUser();

        $this->app->make(JournalCommands::class)->runAsJournal(
            CommandEntry::HostControl,
            'test host',
            new CompleteSignInCommand($started->attemptId, 0, $identity),
        );

        $this->journal->actAs('Owner');

        return $started->attemptId;
    }

    private function complete(string $attemptId, int $generation, string|null $display): void
    {
        $this->app->make(JournalCommands::class)->runAsJournal(
            CommandEntry::HostControl,
            'test host',
            new CompleteSignInCommand($attemptId, $generation, SignInIdentity::shown($display)),
        );

        $this->journal->actAs('Owner');
    }

    /**
     * The attempt's target and result account as a reader sees them now.
     *
     * @return array{string|null, string|null}
     */
    private function targetAndResultOf(string $attemptId): array
    {
        $attempt = SignInAttemptData::fromAttempt(
            SignInAttempt::query()->withoutGlobalScopes()->whereKey($attemptId)->with('resultAccount')->sole(),
        );

        return [$attempt->accountId, $attempt->resultAccountId];
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }

    /**
     * A key attempt for Claude Code, given its key and verified by the host.
     */
    private function verifiedKey(string $requestKey, string $key): SignInAttempt
    {
        $attempt = SignInAttempt::create(
            ActorReference::forUser($this->journal->ownerUser()->id),
            DefaultDrivers::CLAUDE_CODE,
            SignInMethod::ApiKey,
            '/journal/accounts/'.$requestKey,
            CarbonImmutable::now()->addMinutes(10),
        );
        $this->submit($attempt, $key);
        $attempt->waitForUser();
        $this->app->make(JournalCommands::class)->runAsJournal(
            CommandEntry::HostControl,
            'test host',
            new CompleteSignInCommand($attempt->id, $attempt->refresh()->generation, SignInIdentity::unproved()),
        );

        return $attempt;
    }

    private function submit(SignInAttempt $attempt, string $text): void
    {
        $attempt->waitForUser();
        $this->app->make(CommandBus::class)->run(
            new SubmitSignInCodeCommand($attempt->id, $text, 'answer-'.bin2hex(random_bytes(4))),
        );
    }
}
