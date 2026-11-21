<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Enums\AccountProcessRole;
use App\Agents\Enums\ProcessStartState;
use App\Agents\Exceptions\AccountUnavailable;
use App\Bus\Contracts\CommandBus;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Bus\Support\EntryDispatchers;
use App\Drivers\Enums\HookDriver;
use App\Profiles\Commands\BeginSignInAgain;
use App\Profiles\Commands\CancelSignIn;
use App\Profiles\Commands\CheckAccount;
use App\Profiles\Commands\CompleteSignIn;
use App\Profiles\Commands\ReconcileAccounts;
use App\Profiles\Enums\AccountCheckResult;
use App\Profiles\Enums\AccountState;
use App\Profiles\Enums\SignInMethod;
use App\Profiles\Enums\SignInState;
use App\Profiles\Jobs\SignInDeadline;
use App\Profiles\Models\Account;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Values\AccountLabel;
use App\Profiles\Values\SignInIdentity;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
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

        $this->asHost(new CompleteSignIn($attemptId, $generation, self::proved('subject-1')));

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
        $this->asHost(new CompleteSignIn($attemptId, $generation, self::proved('subject-1')));

        $this->assertSame($staging, $this->account->refresh()->directory);
        $attempt = SignInAttempt::query()->whereKey($attemptId)->sole();
        $this->assertSame(SignInState::Complete, $attempt->state);
        $this->assertSame($saved, $attempt->directory);
        $this->assertTrue($attempt->cleanup_pending);
        $this->assertSame($attemptId, SignInAttempt::nextToClean()?->id);
    }

    public function test_another_principal_or_none_replaces_nothing_and_ends_as_a_different_account(): void
    {
        $saved = (string) $this->account->directory;

        foreach ([self::proved('subject-2'), SignInIdentity::shown('me@example.com')] as $identity) {
            [$attemptId] = $this->waitingReconnect();
            $generation = SignInAttempt::query()->whereKey($attemptId)->sole()->generation;

            $this->asHost(new CompleteSignIn($attemptId, $generation, $identity));

            $state = SignInAttempt::query()->whereKey($attemptId)->sole()->state;
            $this->assertSame(SignInState::DifferentAccount, $state);
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

        $this->asHost(new CompleteSignIn($attemptId, $attempt->generation, SignInIdentity::unproved()));

        $this->account->refresh();
        $this->assertSame(SignInMethod::ApiKey, $attempt->method);
        $this->assertSame([$staging, 'new'], [$this->account->directory, $this->account->fingerprint]);
        $this->assertSame($this->account->id, $this->chosen());
    }

    public function test_a_key_another_account_already_holds_ends_already_added(): void
    {
        $this->account->forceFill(['method' => SignInMethod::ApiKey, 'fingerprint' => 'old'])->save();
        $other = Account::create(HookDriver::Codex, AccountLabel::from('Other'), '/journal/accounts/other');
        $other->forceFill(['fingerprint' => 'shared'])->save();
        $saved = $this->account->directory;
        [$attemptId] = $this->waitingReconnect();
        $attempt = SignInAttempt::query()->whereKey($attemptId)->sole();
        $attempt->keepFingerprint('shared');

        $this->asHost(new CompleteSignIn($attemptId, $attempt->generation, SignInIdentity::unproved()));

        $this->assertSame(SignInState::AlreadyAdded, $attempt->refresh()->state);
        $this->assertSame($saved, $this->account->refresh()->directory);
    }

    public function test_no_cleanup_is_handed_out_for_a_folder_an_account_still_uses(): void
    {
        [$attemptId] = $this->waitingReconnect();
        $this->cancel($attemptId);
        $attempt = SignInAttempt::query()->whereKey($attemptId)->sole();
        $this->account->forceFill(['directory' => $attempt->directory])->save();

        $this->assertNull(SignInAttempt::nextToClean());
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
        $this->assertSame($attemptId, SignInAttempt::nextToClean()?->id);
    }

    public function test_a_cancelled_sign_in_of_a_valid_account_survives_its_certain_check(): void
    {
        $this->cancel($this->again('tab-1'));
        $generation = $this->account->refresh()->sign_in_generation;

        $this->assertTrue($this->account->isHeldForCheck());
        $this->asHost(new CheckAccount('host', $this->account->id, $generation, AccountCheckResult::Unknown));
        $this->assertTrue($this->account->refresh()->isHeldForCheck());

        $this->asHost(new CheckAccount('host', $this->account->id, $generation, AccountCheckResult::SignedIn));

        $this->account->refresh();
        $this->assertFalse($this->account->maintenance);
        $this->assertSame(AccountState::SignedIn, $this->account->state);
        $this->assertSame($this->account->id, $this->chosen());
    }

    public function test_a_cancelled_sign_in_that_left_the_account_signed_out_clears_the_choice(): void
    {
        $this->cancel($this->again('tab-1'));
        $generation = $this->account->refresh()->sign_in_generation;

        $this->asHost(new CheckAccount('host', $this->account->id, $generation, AccountCheckResult::SignedOut));

        $this->assertSame(AccountState::NeedsSignIn, $this->account->refresh()->state);
        $this->assertNull($this->chosen());
    }

    public function test_an_older_attempts_end_never_releases_a_newer_writer(): void
    {
        $old = $this->again('tab-1');
        $this->cancel($old);
        $generation = $this->account->refresh()->sign_in_generation;
        $this->asHost(new CheckAccount('host', $this->account->id, $generation, AccountCheckResult::SignedIn));
        $new = $this->again('tab-2');

        $this->account->refresh()->endSignInAgain($old);

        $this->account->refresh();
        $this->assertSame($new, $this->account->live_writer_attempt_id);
        $this->assertTrue($this->account->maintenance);
    }

    private function again(string $requestKey): string
    {
        $this->actAsOwner();

        return $this->runOnBus(new BeginSignInAgain($this->account->id), $requestKey)
            ->attemptId;
    }

    private function cancel(string $attemptId): void
    {
        $this->actAsOwner();
        $this->app->make(CommandBus::class)->run(new CancelSignIn($attemptId));
    }

    private function asHost(Command $command): void
    {
        $this->app->make(EntryDispatchers::class)->runAsJournal(CommandEntry::HostControl, 'test host', $command);
    }

    private function reconcile(): void
    {
        $this->app->make(EntryDispatchers::class)
            ->runAsJournal(CommandEntry::AccountMaintenance, 'account reconciliation', new ReconcileAccounts());
    }

    private function chosen(): string|null
    {
        return ActiveAccount::query()->withoutGlobalScopes()->where('driver', 'codex')->value('account_id');
    }

    private function startProcessOnAccount(): void
    {
        DB::table('process_starts')->insert([
            'id' => strtolower((string) Str::ulid()),
            'agent_id' => strtolower((string) Str::ulid()),
            'session_id' => strtolower((string) Str::ulid()),
            'start_key' => (string) Str::ulid(),
            'account_type' => Account::LINK_TYPE,
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
