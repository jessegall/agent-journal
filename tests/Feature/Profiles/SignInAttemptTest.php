<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\BeginSignIn\BeginSignInCommand;
use App\Commands\BeginSignInAgain\BeginSignInAgainCommand;
use App\Commands\CancelSignIn\CancelSignInCommand;
use App\Commands\CompleteSignIn\CompleteSignInCommand;
use App\Commands\ReconcileAccounts\ReconcileAccountsCommand;
use App\Contracts\CommandBus;
use App\Contracts\CurrentActorSetter;
use App\Data\Profiles\SignInAttemptData;
use App\Enums\AccountState;
use App\Enums\CommandEntry;
use App\Enums\SignInMethod;
use App\Enums\SignInState;
use App\Events\AccountsChanged;
use App\Exceptions\SignInAttemptStale;
use App\Jobs\SignInDeadline;
use App\Models\Account;
use App\Models\ActiveAccount;
use App\Models\SignInAttempt;
use App\Support\ActorContext;
use App\Support\EntryDispatchers;
use App\Values\OwnerAuthority;
use App\Values\SignInIdentity;
use App\Values\SignInStarted;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A sign-in attempt from start to its end: a second start rejoins the one running, its deadline job holds only its
 * id, the host's verified result is saved once and only while it still speaks for the attempt, and the minute sweep
 * ends what the deadline job missed.
 */
#[TimeLimit(seconds: 3, reason: 'It commits attempts and accounts through the bus and empties five tables per test.')]
final class SignInAttemptTest extends TestCase
{
    use CommitsHookRows;
    use RunsKeyedCommands;
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

        User::factory()->create(['id' => TestIds::of(1)]);
        $this->app->instance(AccessSettings::class, new AccessSettings(TestIds::of(1)));

        Bus::fake([SignInDeadline::class]);
        $this->actAsOwner();
    }

    public function test_a_second_start_and_a_repeated_request_rejoin_the_running_attempt(): void
    {
        $first = $this->begin('request-1');
        $second = $this->begin('request-2');
        $repeated = $this->begin('request-1');

        $this->assertFalse($first->didRejoin);
        $this->assertSame([$first->attemptId, $first->attemptId], [$second->attemptId, $repeated->attemptId]);
        $this->assertSame(1, SignInAttempt::query()->count());
        Bus::assertDispatched(SignInDeadline::class, fn (SignInDeadline $job) => $job->attemptId === $first->attemptId);
    }

    public function test_a_verified_sign_in_makes_the_first_account_and_chooses_it_once(): void
    {
        $started = $this->begin('request-1');
        SignInAttempt::query()->whereKey($started->attemptId)->sole()->waitForUser();

        $this->complete($started->attemptId, 0, 'work@example.test');

        $account = Account::query()->sole();
        $this->assertSame([AccountState::SignedIn, 'work@example.test'], [$account->state, $account->label]);
        $this->assertSame($account->id, ActiveAccount::query()->sole()->account_id);
        $this->assertSame(SignInState::Complete, SignInAttempt::query()->sole()->state);
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
        $this->assertSame(SignInState::AlreadyAdded, SignInAttempt::query()->whereKey($known)->sole()->state);
        $first = Account::query()->orderBy('created_at')->firstOrFail();
        $this->assertSame($first->id, ActiveAccount::query()->sole()->account_id);
    }

    public function test_an_attempt_names_the_account_it_made_renewed_or_matched_apart_from_its_target(): void
    {
        $added = $this->completeNew('request-1', new SignInIdentity('a@example.test', 'subject-1', null));
        $account = Account::query()->sole();
        $matched = $this->completeNew('request-2', new SignInIdentity('a@example.test', 'subject-1', null));
        $again = $this->runOnBus(new BeginSignInAgainCommand($account->id), 'request-3');
        $renewal = SignInAttempt::query()->whereKey($again->attemptId)->sole();
        $renewal->waitForUser();
        $this->app->make(EntryDispatchers::class)->runAsJournal(
            CommandEntry::HostControl,
            'test host',
            new CompleteSignInCommand($again->attemptId, $renewal->generation, new SignInIdentity('a@example.test', 'subject-1', null)),
        );
        $this->actAsOwner();

        $this->assertSame([null, $account->id], $this->targetAndResultOf($added));
        $this->assertSame([null, $account->id], $this->targetAndResultOf($matched));
        $this->assertSame([$account->id, $account->id], $this->targetAndResultOf($again->attemptId));

        $this->app->make(CurrentActorSetter::class)->clear();
        $this->assertSame([null, null], $this->targetAndResultOf($added));
    }

    public function test_a_login_named_only_by_email_is_a_new_row_that_says_it_cannot_be_matched(): void
    {
        $this->completeNew('request-1', SignInIdentity::shown('same@example.test'));
        $second = $this->completeNew('request-2', SignInIdentity::shown('same@example.test'));

        $this->assertSame(2, Account::query()->count());
        $attempt = SignInAttemptData::fromAttempt(
            SignInAttempt::query()->whereKey($second)->with('resultAccount')->sole(),
        );
        $this->assertSame(SignInState::Complete, $attempt->state);
        $this->assertTrue($attempt->isResultUnmatchable);
    }

    public function test_a_starter_that_lost_its_grant_before_the_report_adds_no_account(): void
    {
        $started = $this->begin('request-1');
        SignInAttempt::query()->whereKey($started->attemptId)->sole()->waitForUser();
        $this->app->instance(AccessSettings::class, new AccessSettings(TestIds::of(2)));

        $this->complete($started->attemptId, 0, 'work@example.test');

        $this->assertSame(0, Account::query()->count());
        $this->assertSame(SignInState::Failed, SignInAttempt::query()->sole()->state);
    }

    public function test_a_cancelled_attempt_ignores_a_late_result_and_owes_its_folder_cleanup(): void
    {
        $started = $this->begin('request-1');

        $this->bus()->run(new CancelSignInCommand($started->attemptId));

        $attempt = SignInAttempt::query()->sole();
        $this->assertSame(SignInState::Cancelled, $attempt->state);
        $this->assertTrue($attempt->cleanup_pending);
        $this->expectException(SignInAttemptStale::class);

        $this->complete($started->attemptId, 0, null);
    }

    public function test_the_sweep_ends_an_overdue_attempt_and_signing_in_again_holds_the_folder_once(): void
    {
        $account = $this->chooseActiveAccounts()['codex'];
        $this->actAsOwner();
        $again = $this->runOnBus(new BeginSignInAgainCommand($account->id), 'request-again');
        $rejoined = $this->runOnBus(new BeginSignInAgainCommand($account->id), 'request-other');

        $this->assertSame($again->attemptId, $rejoined->attemptId);
        $this->assertSame($again->attemptId, $account->refresh()->live_writer_attempt_id);
        $this->travel(16)->minutes();

        $ended = $this->app->make(EntryDispatchers::class)
            ->runAsJournal(CommandEntry::AccountMaintenance, 'test sweep', new ReconcileAccountsCommand());

        $this->assertSame(1, $ended);
        $this->assertSame(SignInState::Expired, SignInAttempt::query()->whereKey($again->attemptId)->sole()->state);
        $this->assertNull($account->refresh()->live_writer_attempt_id);
    }

    private function begin(string $requestKey): SignInStarted
    {
        return $this->runOnBus(new BeginSignInCommand('claude-code', SignInMethod::OAuth), $requestKey);
    }

    /**
     * A new account's sign-in, started and verified with this identity; answers its attempt.
     */
    private function completeNew(string $requestKey, SignInIdentity $identity): string
    {
        $started = $this->begin($requestKey);
        SignInAttempt::query()->whereKey($started->attemptId)->sole()->waitForUser();
        $this->app->make(EntryDispatchers::class)->runAsJournal(
            CommandEntry::HostControl,
            'test host',
            new CompleteSignInCommand($started->attemptId, 0, $identity),
        );
        $this->actAsOwner();

        return $started->attemptId;
    }

    private function complete(string $attemptId, int $generation, string|null $display): void
    {
        $this->app->make(EntryDispatchers::class)->runAsJournal(
            CommandEntry::HostControl,
            'test host',
            new CompleteSignInCommand($attemptId, $generation, SignInIdentity::shown($display)),
        );
        $this->actAsOwner();
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

    private function actAsOwner(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
