<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\Accounts\BeginSignInAgain\BeginSignInAgainCommand;
use App\Commands\Accounts\CancelSignIn\CancelSignInCommand;
use App\Commands\Accounts\CheckAccount\CheckAccountCommand;
use App\Commands\Accounts\CompleteSignIn\CompleteSignInCommand;
use App\Commands\Accounts\RecheckAccount\RecheckAccountCommand;
use App\Commands\Accounts\ReconcileAccounts\ReconcileAccountsCommand;
use App\Commands\Accounts\RemoveAccount\RemoveAccountCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Enums\Accounts\AccountCheckResult;
use App\Enums\Accounts\AccountProcessRole;
use App\Enums\Accounts\AccountState;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Accounts\SignInMethod;
use App\Enums\Accounts\SignInState;
use App\Enums\Agents\ProcessStartState;
use App\Exceptions\AccountRecheckRefused;
use App\Exceptions\AccountUnavailable;
use App\Exceptions\SignInAttemptStale;
use App\Jobs\SignInDeadline;
use App\Models\Access\User;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Models\Accounts\SignInAttempt;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Support\Command;
use App\Support\DefaultDrivers;
use App\Support\EntryDispatchers;
use App\Values\AccountLabel;
use App\Values\OwnerAuthority;
use App\Values\SignInIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * Signing a saved account in again: one writer however many tabs start it, no host runs it while a process still
 * runs on the account, success starts a new generation and keeps the choice, and a sign-in that ends otherwise holds
 * starts until the host's certain check says whether the account still signs in.
 */
#[TimeLimit(seconds: 4, reason: 'It commits accounts, attempts and starts through the bus and empties seven tables.')]
final class SignInAgainTest extends TestCase
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
        'process_starts',
        'account_notices',
    ];

    private Account $account;

    protected function setUp(): void
    {
        parent::setUp();

        User::factory()->create(['id' => TestIds::of(1)]);
        $this->app->instance(AccessSettings::class, new AccessSettings(TestIds::of(1)));

        Bus::fake([SignInDeadline::class]);
        $this->account = $this->chooseActiveAccounts()['codex'];
        $this->account->forceFill(['subject' => 'subject-1'])->save();
    }

    public function test_two_tabs_start_one_writer_and_new_starts_wait(): void
    {
        $generation = $this->account->sign_in_generation;

        $first = $this->again('tab-1');
        $second = $this->again('tab-2');

        $this->assertSame($first, $second);
        $this->account->refresh();
        $this->assertSame($first, $this->account->live_writer_attempt_id);
        $this->assertSame($generation + 1, $this->account->sign_in_generation);
        $this->expectException(AccountUnavailable::class);
        $this->account->assertAvailable();
    }

    public function test_the_host_takes_it_only_after_the_accounts_processes_ended(): void
    {
        $this->startProcessOnAccount();
        $attemptId = $this->again('tab-1');

        $this->assertNull($this->claimSignIn('host', CarbonImmutable::now()));
        $this->reconcile();
        $this->assertNull($this->claimSignIn('host', CarbonImmutable::now()));

        DB::table('process_starts')->update(['state' => ProcessStartState::Stopped->value]);
        $this->reconcile();

        $this->assertSame($attemptId, $this->claimSignIn('host', CarbonImmutable::now())?->id);
    }

    public function test_success_starts_a_new_generation_and_keeps_the_choice(): void
    {
        $attemptId = $this->again('tab-1');
        $generation = $this->account->refresh()->sign_in_generation;
        SignInAttempt::query()->whereKey($attemptId)->sole()->waitForUser();

        $this->asHost(new CompleteSignInCommand($attemptId, $generation, self::proved('subject-1')));

        $this->account->refresh();
        $this->assertSame($generation + 1, $this->account->sign_in_generation);
        $this->assertFalse($this->account->maintenance);
        $this->assertSame($this->account->id, $this->chosen());
    }

    public function test_the_same_principal_moves_the_account_to_its_staging_folder_and_owes_the_old_one(): void
    {
        $saved = (string) $this->account->directory;
        [$attemptId, $staging] = $this->waitingReconnect();

        $generation = SignInAttempt::query()->whereKey($attemptId)->sole()->generation;
        $this->asHost(new CompleteSignInCommand($attemptId, $generation, self::proved('subject-1')));

        $this->assertSame($staging, $this->account->refresh()->directory);
        $attempt = SignInAttempt::query()->whereKey($attemptId)->sole();
        $this->assertSame(SignInState::Complete, $attempt->state);
        $this->assertSame($saved, $attempt->directory);
        $this->assertTrue($attempt->cleanup_pending);
        $this->assertSame($attemptId, SignInAttempt::nextDueForCleanup()?->id);
    }

    public function test_another_principal_ends_as_a_different_account_and_none_cannot_verify_and_both_replace_nothing(): void
    {
        $saved = (string) $this->account->directory;

        $outcomes = [
            [self::proved('subject-2'), SignInState::DifferentAccount],
            [SignInIdentity::shown('me@example.com'), SignInState::Unverified],
        ];

        foreach ($outcomes as [$identity, $expected]) {
            [$attemptId] = $this->waitingReconnect();
            $generation = SignInAttempt::query()->whereKey($attemptId)->sole()->generation;

            $this->asHost(new CompleteSignInCommand($attemptId, $generation, $identity));

            $state = SignInAttempt::query()->whereKey($attemptId)->sole()->state;
            $this->assertSame($expected, $state);
            $this->assertSame($saved, $this->account->refresh()->directory);
            $this->assertNull($this->account->live_writer_attempt_id);
            $this->account->forceFill(['maintenance' => false, 'check_requested_generation' => null])->save();
        }
    }

    public function test_replace_key_swaps_a_key_account_to_its_new_key_without_a_subject(): void
    {
        $keyAccount = ['method' => SignInMethod::ApiKey, 'fingerprint' => 'old', 'subject' => null];
        $this->account->forceFill($keyAccount)->save();
        [$attemptId, $staging] = $this->waitingReconnect();
        $attempt = SignInAttempt::query()->whereKey($attemptId)->sole();
        $attempt->keepFingerprint('new');

        $this->asHost(new CompleteSignInCommand($attemptId, $attempt->generation, SignInIdentity::unproved()));

        $this->account->refresh();
        $this->assertSame(SignInMethod::ApiKey, $attempt->method);
        $this->assertSame([$staging, 'new'], [$this->account->directory, $this->account->fingerprint]);
        $this->assertSame($this->account->id, $this->chosen());
    }

    public function test_a_key_another_account_already_holds_ends_already_added(): void
    {
        $this->account->forceFill(['method' => SignInMethod::ApiKey, 'fingerprint' => 'old'])->save();
        $other = Account::create(DefaultDrivers::CODEX, AccountLabel::from('Other'), '/journal/accounts/other');
        $other->forceFill(['fingerprint' => 'shared'])->save();
        $saved = $this->account->directory;
        [$attemptId] = $this->waitingReconnect();
        $attempt = SignInAttempt::query()->whereKey($attemptId)->sole();
        $attempt->keepFingerprint('shared');

        $this->asHost(new CompleteSignInCommand($attemptId, $attempt->generation, SignInIdentity::unproved()));

        $this->assertSame(SignInState::AlreadyAdded, $attempt->refresh()->state);
        $this->assertSame($saved, $this->account->refresh()->directory);
    }

    public function test_no_cleanup_is_handed_out_for_a_folder_an_account_still_uses(): void
    {
        [$attemptId] = $this->waitingReconnect();
        $this->cancel($attemptId);
        $attempt = SignInAttempt::query()->whereKey($attemptId)->sole();
        $this->account->forceFill(['directory' => $attempt->directory])->save();

        $this->assertNull(SignInAttempt::nextDueForCleanup());
    }

    /**
     * A reconnect of the account, waiting for the user, and its staging folder.
     *
     * @return array{string, string}
     */
    private function waitingReconnect(): array
    {
        $attemptId = $this->again('tab-'.bin2hex(random_bytes(3)));
        $attempt = SignInAttempt::query()->whereKey($attemptId)->sole();
        $attempt->waitForUser();

        return [$attemptId, (string) $attempt->directory];
    }

    private static function proved(string $subject): SignInIdentity
    {
        return new SignInIdentity('me@example.com', $subject, null);
    }

    public function test_a_reconnect_signs_in_to_its_own_staging_folder_and_a_cancel_cleans_only_that(): void
    {
        $saved = $this->account->directory;
        $attemptId = $this->again('tab-1');
        $staging = (string) SignInAttempt::query()->whereKey($attemptId)->sole()->directory;

        $this->cancel($attemptId);

        $this->assertNotSame($saved, $staging);
        $this->assertStringStartsWith(config('accounts.root').'/', $staging);
        $this->assertSame($saved, $this->account->refresh()->directory);
        $pending = array_map(fn (SignInAttempt $attempt) => $attempt->id, SignInAttempt::pendingCleanups());
        $this->assertSame([$attemptId], $pending);
        $this->assertSame($attemptId, SignInAttempt::nextDueForCleanup()?->id);
    }

    public function test_a_cancelled_sign_in_of_a_valid_account_survives_its_certain_check(): void
    {
        $this->cancel($this->again('tab-1'));
        $generation = $this->account->refresh()->sign_in_generation;

        $this->assertTrue($this->account->isHeldForCheck());
        $this->asHost(new CheckAccountCommand('host', $this->account->id, $generation, AccountCheckResult::Unknown));
        $this->assertTrue($this->account->refresh()->isHeldForCheck());

        $this->asHost(new CheckAccountCommand('host', $this->account->id, $generation, AccountCheckResult::SignedIn));

        $this->account->refresh();
        $this->assertFalse($this->account->maintenance);
        $this->assertSame(AccountState::Authenticated, $this->account->state);
        $this->assertSame($this->account->id, $this->chosen());
    }

    public function test_an_inconclusive_check_waits_for_the_owners_recheck(): void
    {
        $this->cancel($this->again('tab-1'));
        $generation = $this->account->refresh()->sign_in_generation;

        $this->asHost(new CheckAccountCommand('host', $this->account->id, $generation, AccountCheckResult::Unknown));

        $this->assertTrue($this->account->refresh()->isCheckInconclusive());
        $this->assertNull(Account::nextDueForCheck());

        $this->actAsOwner();
        $this->app->make(CommandBus::class)->run(new RecheckAccountCommand($this->account->id));

        $this->assertFalse($this->account->refresh()->isCheckInconclusive());
        $this->assertTrue($this->account->isHeldForCheck());
        $this->assertSame($this->account->id, Account::nextDueForCheck()?->id);
        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new RecheckAccountCommand($this->account->id)),
            AccountRecheckRefused::class,
        );
    }

    public function test_a_cancelled_sign_in_that_left_the_account_signed_out_clears_the_choice(): void
    {
        $this->cancel($this->again('tab-1'));
        $generation = $this->account->refresh()->sign_in_generation;

        $this->asHost(new CheckAccountCommand('host', $this->account->id, $generation, AccountCheckResult::SignedOut));

        $this->assertSame(AccountState::Unauthenticated, $this->account->refresh()->state);
        $this->assertNull($this->chosen());
    }

    public function test_a_failed_renewal_of_an_account_that_needed_sign_in_lets_it_go_at_once(): void
    {
        $this->account->forceFill(['state' => AccountState::Unauthenticated])->save();
        [$label, $folder] = [$this->account->label, $this->account->directory];

        $this->cancel($this->again('tab-1'));

        $this->account->refresh();
        $this->assertFalse($this->account->maintenance);
        $this->assertFalse($this->account->isHeldForCheck());
        $this->assertNull($this->account->live_writer_attempt_id);
        $this->assertSame([AccountState::Unauthenticated, $label, $folder], [
            $this->account->state,
            $this->account->label,
            $this->account->directory,
        ]);
    }

    public function test_a_proof_arriving_during_removal_changes_nothing(): void
    {
        [$attemptId] = $this->waitingReconnect();
        $folder = $this->account->refresh()->directory;
        $generation = SignInAttempt::query()->whereKey($attemptId)->sole()->generation;

        $this->actAsOwner();
        $this->app->make(CommandBus::class)->run(new RemoveAccountCommand($this->account->id));
        $this->assertThrows(
            fn () => $this->asHost(new CompleteSignInCommand($attemptId, $generation, self::proved('subject-1'))),
            SignInAttemptStale::class,
        );

        $this->assertSame(SignInState::Cancelled, SignInAttempt::query()->whereKey($attemptId)->sole()->state);
        $this->account->refresh();
        $this->assertSame($folder, $this->account->directory);
        $this->assertNotSame(AccountState::Authenticated, $this->account->state);
        $this->assertNull($this->chosen());
    }

    public function test_an_older_attempts_end_never_releases_a_newer_writer(): void
    {
        $old = $this->again('tab-1');
        $this->cancel($old);
        $generation = $this->account->refresh()->sign_in_generation;
        $this->asHost(new CheckAccountCommand('host', $this->account->id, $generation, AccountCheckResult::SignedIn));
        $new = $this->again('tab-2');

        $this->account->refresh()->endSignInAgain($old);

        $this->account->refresh();
        $this->assertSame($new, $this->account->live_writer_attempt_id);
        $this->assertTrue($this->account->maintenance);
    }

    private function again(string $requestKey): string
    {
        $this->actAsOwner();

        return $this->runOnBus(new BeginSignInAgainCommand($this->account->id), $requestKey)
            ->attemptId;
    }

    private function cancel(string $attemptId): void
    {
        $this->actAsOwner();
        $this->app->make(CommandBus::class)->run(new CancelSignInCommand($attemptId));
    }

    private function asHost(Command $command): void
    {
        $this->app->make(EntryDispatchers::class)->runAsJournal(CommandEntry::HostControl, 'test host', $command);
    }

    private function reconcile(): void
    {
        $this->app->make(EntryDispatchers::class)
            ->runAsJournal(CommandEntry::AccountMaintenance, 'account reconciliation', new ReconcileAccountsCommand());
    }

    private function chosen(): string|null
    {
        return ActiveAccount::query()->withoutGlobalScopes()->where('account_protocol', 'codex')->value('account_id');
    }

    private function startProcessOnAccount(): void
    {
        DB::table('process_starts')->insert([
            'id' => strtolower((string) Str::ulid()),
            'agent_id' => strtolower((string) Str::ulid()),
            'session_id' => strtolower((string) Str::ulid()),
            'start_key' => (string) Str::ulid(),
            'account_type' => Account::linkType(),
            'account_id' => $this->account->id,
            'account_generation' => $this->account->sign_in_generation,
            'directory' => (string) $this->account->directory,
            'state' => ProcessStartState::Running->value,
            'role' => AccountProcessRole::Execution->value,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    private function actAsOwner(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
    }

    private function claimSignIn(string $hostId, CarbonImmutable $now): SignInAttempt|null
    {
        $attempt = SignInAttempt::oldestWaitingAt($now);
        $attempt?->claimOn($hostId);

        return $attempt;
    }
}
