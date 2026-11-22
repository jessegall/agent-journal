<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Enums\AccountProcessRole;
use App\Agents\Enums\ProcessStartState;
use App\Agents\Exceptions\AccountUnavailable;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Bus\Support\EntryDispatchers;
use App\Drivers\Enums\HookDriver;
use App\Files\Contracts\Files;
use App\Profiles\Commands\BeginSignIn\BeginSignInCommand;
use App\Profiles\Commands\BeginSignInAgain\BeginSignInAgainCommand;
use App\Profiles\Commands\CancelSignIn\CancelSignInCommand;
use App\Profiles\Commands\ClaimCleanup\ClaimCleanupCommand;
use App\Profiles\Commands\CleanAccount\CleanAccountCommand;
use App\Profiles\Commands\CleanSignInAttempt\CleanSignInAttemptCommand;
use App\Profiles\Commands\ReconcileAccounts\ReconcileAccountsCommand;
use App\Profiles\Commands\RemoveAccount\RemoveAccountCommand;
use App\Profiles\Commands\RetryAccountCleanup\RetryAccountCleanupCommand;
use App\Profiles\Commands\RetryAttemptCleanup\RetryAttemptCleanupCommand;
use App\Profiles\Contracts\AccountOwnerDrain;
use App\Profiles\Enums\AccountState;
use App\Profiles\Enums\CleanupProblem;
use App\Profiles\Enums\CleanupTarget;
use App\Profiles\Enums\SignInMethod;
use App\Profiles\Enums\SignInState;
use App\Profiles\Enums\UsageWindowSlot;
use App\Profiles\Jobs\SignInDeadline;
use App\Profiles\Models\Account;
use App\Profiles\Models\AccountUsageCost;
use App\Profiles\Models\AccountUsageTokens;
use App\Profiles\Models\AccountUsageWindow;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Resolvers\AccountsWindowResolver;
use App\Profiles\Support\LocalAccountFolders;
use App\Profiles\Support\PrivateSignInProcesses;
use App\Profiles\Support\SignInProtocols;
use App\Profiles\Support\UsageReadings;
use App\Profiles\Values\AccountLabel;
use App\Profiles\Values\ClaimedCleanup;
use App\Profiles\Values\CleanupProgress;
use App\Profiles\Values\ThreadTokens;
use App\Profiles\Values\UsageCost;
use App\Profiles\Values\UsageSource;
use App\Profiles\Values\UsageWindowReading;
use App\Profiles\Values\UsdAmount;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use LogicException;
use Tests\Fixtures\Profiles\FinishingProtocol;
use Tests\Fixtures\Profiles\RecordingSignInHost;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsKeyedCommands;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * Removing an account is one operation in a new generation: it leaves the choice without a replacement, waits for
 * every process on the account, and ends only when the host proved both the sign-in store and the folder gone; the
 * row and its label stay.
 */
#[TimeLimit(seconds: 4, reason: 'It commits accounts, attempts and starts through the bus and empties seven tables.')]
final class AccountRemovalTest extends TestCase
{
    use CommitsHookRows;
    use RunsKeyedCommands;
    use WithActiveAccount;

    private const string NO_DEFAULT_ACCOUNT = 'codex cannot be started now: no default account is chosen for it; '
        .'choose one in Accounts.';

    private const string ACCOUNT_LABEL = 'Test account';

    private const array TABLES = [
        'account_usage_windows',
        'account_usage_costs',
        'account_usage_tokens',
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

        // The account folders of this test lie in the system's temporary folder, so the accounts root is that folder.
        config(['accounts.root' => sys_get_temp_dir()]);

        Bus::fake([SignInDeadline::class]);
        $this->account = $this->chooseActiveAccounts()['codex'];
    }

    public function test_removal_cancels_a_running_sign_in_and_leaves_no_replacement_chosen(): void
    {
        Account::create(HookDriver::Codex, AccountLabel::from('Home'), '/journal/accounts/home');
        $this->asOwner(new BeginSignInAgainCommand($this->account->id));
        $generation = $this->account->refresh()->sign_in_generation;

        $this->asOwner(new RemoveAccountCommand($this->account->id));
        $this->asOwner(new RemoveAccountCommand($this->account->id));

        $this->account->refresh();
        $this->assertSame(AccountState::Removing, $this->account->state);
        $this->assertSame($generation + 1, $this->account->sign_in_generation);
        $this->assertNull($this->account->live_writer_attempt_id);
        $this->assertSame(SignInState::Cancelled, SignInAttempt::query()->withoutGlobalScopes()->sole()->state);
        $this->assertNull(
            ActiveAccount::query()->withoutGlobalScopes()->where('account_protocol', 'codex')->value('account_id'),
        );
        $this->assertThrows(
            fn () => ActiveAccount::lockedAccountForStart(HookDriver::Codex),
            AccountUnavailable::class,
            self::NO_DEFAULT_ACCOUNT,
        );
    }

    public function test_a_host_cleans_only_after_every_process_ended_and_only_with_both_proofs(): void
    {
        $this->startProcessOnAccount();
        $this->asOwner(new RemoveAccountCommand($this->account->id));
        $this->reconcile();
        $this->assertNull($this->asHost(new ClaimCleanupCommand('host')));

        DB::table('process_starts')->update(['state' => ProcessStartState::Stopped->value]);
        $this->reconcile();
        $claimed = $this->asHost(new ClaimCleanupCommand('host'));
        $this->assertInstanceOf(ClaimedCleanup::class, $claimed);
        $this->assertSame([CleanupTarget::Account, $this->account->id], [$claimed->target, $claimed->id]);

        $this->clean($claimed->generation - 1, true, true);
        $this->clean($claimed->generation, false, true);
        $this->assertSame(AccountState::Removing, $this->account->refresh()->state);
        $this->assertNotNull($this->account->directory);

        $this->clean($claimed->generation, true, false);
        $this->assertTrue($this->account->refresh()->store_removed);
        $this->keepUsage();
        $this->clean($claimed->generation, false, true);

        $this->account->refresh();
        $this->assertSame(AccountState::Removed, $this->account->state);
        $this->assertSame(0, AccountUsageWindow::query()->withoutGlobalScopes()->count());
        $this->assertSame(0, AccountUsageCost::query()->withoutGlobalScopes()->count());
        $this->assertSame(0, AccountUsageTokens::query()->withoutGlobalScopes()->count());
        $this->assertNull($this->account->directory);
        $this->assertSame(self::ACCOUNT_LABEL, $this->account->label);
    }

    public function test_the_runner_signs_out_before_it_deletes_the_folder(): void
    {
        $directory = sys_get_temp_dir().'/account-cleanup-'.bin2hex(random_bytes(4));
        mkdir($directory);
        $host = new RecordingSignInHost(null);
        $protocols = new SignInProtocols($this->app);
        $protocols->register('codex', SignInMethod::OAuth, FinishingProtocol::class);
        $host->nextCleanup = new ClaimedCleanup(
            CleanupTarget::Account,
            'account',
            'codex',
            SignInMethod::OAuth,
            $directory,
            1,
            false,
            'account',
        );
        $runner = new PrivateSignInProcesses($host, $protocols, static fn () => null, $this->app->make(Files::class), new LocalAccountFolders($this->app->make(Files::class)));

        $this->assertTrue($runner->cleanNext());
        $host->nextCleanup = new ClaimedCleanup(
            CleanupTarget::Account,
            'other',
            'unknown',
            SignInMethod::OAuth,
            $directory.'-x',
            1,
            false,
            'account',
        );
        mkdir($directory.'-x');
        $runner->cleanNext();

        $this->assertEquals(
            [new CleanupProgress(true, true), new CleanupProgress(false, false)],
            $host->cleanups,
        );
        $this->assertDirectoryDoesNotExist($directory);
        $this->assertDirectoryExists($directory.'-x');
        rmdir($directory.'-x');
    }

    public function test_a_cleanup_whose_folder_is_gone_is_done_without_starting_its_program_and_the_drain_goes_on(): void
    {
        $directory = sys_get_temp_dir().'/account-cleanup-'.bin2hex(random_bytes(4));
        $host = new RecordingSignInHost(null);
        $protocols = new SignInProtocols($this->app);
        $protocols->register('codex', SignInMethod::OAuth, FinishingProtocol::class);
        $host->nextCleanup = new ClaimedCleanup(
            CleanupTarget::SignInAttempt,
            'attempt',
            'codex',
            SignInMethod::OAuth,
            $directory,
            1,
            false,
            null,
        );
        $nobodyMayDrain = new class implements AccountOwnerDrain
        {
            public function drain(string $directory, string|null $accountId): bool
            {
                throw new LogicException('a folder that is gone has no owners to drain');
            }

            public function isDisplacedFolderFree(string $directory, string $accountId): bool
            {
                throw new LogicException('a folder that is gone is used by no session');
            }
        };
        $runner = new PrivateSignInProcesses($host, $protocols, static fn () => null, $this->app->make(Files::class), new LocalAccountFolders($this->app->make(Files::class)), $nobodyMayDrain);

        $this->assertTrue($runner->cleanNext());
        $this->assertFalse($runner->cleanNext());

        $this->assertEquals([new CleanupProgress(true, true)], $host->cleanups);
    }

    public function test_an_account_the_host_cannot_drain_keeps_its_sign_in_and_folder(): void
    {
        $directory = sys_get_temp_dir().'/account-cleanup-'.bin2hex(random_bytes(4));
        mkdir($directory);
        $host = new RecordingSignInHost(null);
        $protocols = new SignInProtocols($this->app);
        $protocols->register('codex', SignInMethod::OAuth, FinishingProtocol::class);
        $host->nextCleanup = new ClaimedCleanup(
            CleanupTarget::Account,
            'account',
            'codex',
            SignInMethod::OAuth,
            $directory,
            1,
            false,
            'account',
        );
        $stillRunning = new class implements AccountOwnerDrain
        {
            public function drain(string $directory, string|null $accountId): bool
            {
                return false;
            }

            public function isDisplacedFolderFree(string $directory, string $accountId): bool
            {
                return false;
            }
        };

        new PrivateSignInProcesses($host, $protocols, static fn () => null, $this->app->make(Files::class), new LocalAccountFolders($this->app->make(Files::class)), $stillRunning)->cleanNext();

        $this->assertEquals([new CleanupProgress(false, false)], $host->cleanups);
        $this->assertDirectoryExists($directory);
        rmdir($directory);
    }

    public function test_an_unfinished_new_accounts_sign_in_is_cleaned_with_both_proofs(): void
    {
        $started = $this->asOwner(new BeginSignInCommand('claude-code', SignInMethod::OAuth));
        $this->asOwner(new CancelSignInCommand($started->attemptId));

        $claimed = $this->asHost(new ClaimCleanupCommand('host'));
        $this->assertSame([CleanupTarget::SignInAttempt, $started->attemptId], [$claimed?->target, $claimed?->id]);

        $this->asHost(new CleanSignInAttemptCommand('host', $started->attemptId, new CleanupProgress(true, true)));

        $this->assertFalse(SignInAttempt::query()->withoutGlobalScopes()->sole()->cleanup_pending);
        $this->assertNull($this->asHost(new ClaimCleanupCommand('host')));
    }

    public function test_a_cleanup_out_of_tries_waits_for_the_owners_retry_in_the_same_generation(): void
    {
        $this->asOwner(new RemoveAccountCommand($this->account->id));
        $this->reconcile();
        $generation = $this->account->refresh()->sign_in_generation;

        foreach (range(1, CleanupProgress::MOST_TRIES) as $try) {
            $this->clean($generation, false, true);
        }

        $this->assertNull($this->asHost(new ClaimCleanupCommand('host')));
        $this->assertTrue($this->account->refresh()->awaitsCleanupRetry());
        $this->assertSame(CleanupProblem::SignInNotVerified, $this->account->cleanup_problem);

        $this->asOwner(new RetryAccountCleanupCommand($this->account->id));

        $this->assertSame($generation, $this->asHost(new ClaimCleanupCommand('host'))?->generation);
    }

    public function test_a_displaced_folder_a_running_session_still_uses_is_kept_until_it_is_free(): void
    {
        $directory = sys_get_temp_dir().'/account-cleanup-'.bin2hex(random_bytes(4));
        mkdir($directory);
        $host = new RecordingSignInHost(null);
        $protocols = new SignInProtocols($this->app);
        $protocols->register('codex', SignInMethod::OAuth, FinishingProtocol::class);
        $displaced = new ClaimedCleanup(
            CleanupTarget::SignInAttempt,
            'attempt',
            'codex',
            SignInMethod::OAuth,
            $directory,
            1,
            false,
            'account',
        );
        $session = new class implements AccountOwnerDrain
        {
            public bool $isRunning = true;

            public function drain(string $directory, string|null $accountId): bool
            {
                throw new LogicException('a displaced folder is never drained: that would end the account\'s new runs');
            }

            public function isDisplacedFolderFree(string $directory, string $accountId): bool
            {
                return ! $this->isRunning;
            }
        };
        $runner = new PrivateSignInProcesses($host, $protocols, static fn () => null, $this->app->make(Files::class), new LocalAccountFolders($this->app->make(Files::class)), $session);

        $host->nextCleanup = $displaced;
        $runner->cleanNext();
        $this->assertDirectoryExists($directory);

        $session->isRunning = false;
        $host->nextCleanup = $displaced;
        $runner->cleanNext();

        $this->assertEquals([CleanupProgress::stillBound(), new CleanupProgress(true, true)], $host->cleanups);
        $this->assertDirectoryDoesNotExist($directory);
    }

    public function test_a_folder_still_in_use_counts_no_try_and_says_so(): void
    {
        $started = $this->asOwner(new BeginSignInCommand('claude-code', SignInMethod::OAuth));
        $this->asOwner(new CancelSignInCommand($started->attemptId));

        foreach (range(1, CleanupProgress::MOST_TRIES + 1) as $try) {
            $this->asHost(new CleanSignInAttemptCommand('host', $started->attemptId, CleanupProgress::stillBound()));
        }

        $attempt = SignInAttempt::query()->withoutGlobalScopes()->sole();
        $this->assertSame([0, CleanupProblem::StillBound], [$attempt->cleanup_tries, $attempt->cleanup_problem]);
        $this->assertSame($started->attemptId, $this->asHost(new ClaimCleanupCommand('host'))?->id);
    }

    public function test_the_owner_retries_an_unfinished_sign_ins_cleanup_by_its_attempt(): void
    {
        $started = $this->asOwner(new BeginSignInCommand('claude-code', SignInMethod::OAuth));
        $this->asOwner(new CancelSignInCommand($started->attemptId));

        foreach (range(1, CleanupProgress::MOST_TRIES) as $try) {
            $this->asHost(new CleanSignInAttemptCommand('host', $started->attemptId, new CleanupProgress(false, true)));
        }

        $this->assertNull($this->asHost(new ClaimCleanupCommand('host')));
        $listed = $this->app->make(AccountsWindowResolver::class)->list()->pendingCleanups;
        $this->assertSame([$started->attemptId, true], [$listed[0]->attemptId, $listed[0]->awaitsRetry]);

        $this->asOwner(new RetryAttemptCleanupCommand($started->attemptId));

        $this->assertSame($started->attemptId, $this->asHost(new ClaimCleanupCommand('host'))?->id);
    }

    private function keepUsage(): void
    {
        $generation = $this->account->sign_in_generation;
        $source = UsageSource::of('start-1', 1, CarbonImmutable::now());
        $window = new UsageWindowReading('claude', UsageWindowSlot::SevenDay, 40.0, null, null, $source);
        $this->app->make(UsageReadings::class)->recordWindow($this->account, $generation, $window);
        $cost = new UsageCost('result-1', UsdAmount::from('1'), $source->observedAt);
        AccountUsageCost::add($this->account, $generation, $cost);
        $tokens = new ThreadTokens('thread-1', 10, null, null, null, null, null, $source);
        $this->app->make(UsageReadings::class)->recordTokens($this->account, $generation, $tokens);
        $this->assertSame(1, AccountUsageWindow::query()->withoutGlobalScopes()->count());
    }

    private function clean(int $generation, bool $isStoreRemoved, bool $isDirectoryRemoved): void
    {
        $progress = new CleanupProgress($isStoreRemoved, $isDirectoryRemoved);
        $this->asHost(new CleanAccountCommand('host', $this->account->id, $generation, $progress));
    }

    private function asOwner(Command $command): mixed
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );

        return $this->runOnBus($command);
    }

    private function asHost(Command $command): mixed
    {
        return $this->app->make(EntryDispatchers::class)->runAsJournal(
            CommandEntry::HostControl,
            'test host',
            $command,
        );
    }

    private function reconcile(): void
    {
        $this->app->make(EntryDispatchers::class)
            ->runAsJournal(CommandEntry::AccountMaintenance, 'account reconciliation', new ReconcileAccountsCommand());
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
}
