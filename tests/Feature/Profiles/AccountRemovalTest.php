<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\Accounts\CleanAccount\CleanAccountCommand;
use App\Commands\Accounts\ReconcileAccounts\ReconcileAccountsCommand;
use App\Contracts\Accounts\AccountOwnerDrain;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Files\Files;
use App\Enums\Accounts\AccountProcessRole;
use App\Enums\Accounts\CleanupTarget;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Accounts\SignInMethod;
use App\Enums\Accounts\UsageWindowSlot;
use App\Enums\Agents\SessionProcessStatus;
use App\Jobs\SignInDeadline;
use App\Models\Accounts\Account;
use App\Models\Accounts\AccountUsageCost;
use App\Models\Accounts\AccountUsageWindow;
use App\Support\ActorContext;
use App\Support\Command;
use App\Support\JournalCommands;
use App\Support\LocalAccountFolders;
use App\Support\PrivateSignInProcesses;
use App\Support\SignInProtocols;
use App\Support\UsageReadings;
use App\Values\ClaimedCleanup;
use App\Values\CleanupProgress;
use App\Values\OwnerAuthority;
use App\Values\ThreadTokens;
use App\Values\UsageCost;
use App\Values\UsageSource;
use App\Values\UsageWindowReading;
use App\Values\UsdAmount;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use LogicException;
use Tests\Fixtures\Profiles\FinishingProtocol;
use Tests\Fixtures\Profiles\RecordingSignInHost;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The host's runner cleans a removed account: it signs out before it deletes the folder, a folder already gone is done
 * without starting the program while the drain goes on, an account it cannot drain keeps its sign-in and folder, and a
 * displaced folder a running session still uses is kept until it is free.
 */
#[TimeLimit(seconds: 4, reason: 'It commits accounts, attempts and starts through the bus and empties seven tables.')]
final class AccountRemovalTest extends TestCase
{
    use CommitsHookRows;
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
        'session_processes',
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
        $runner = new PrivateSignInProcesses(
            $host,
            $protocols,
            static fn () => null,
            $this->app->make(Files::class),
            new LocalAccountFolders($this->app->make(Files::class)),
        );

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
        $runner = new PrivateSignInProcesses(
            $host,
            $protocols,
            static fn () => null,
            $this->app->make(Files::class),
            new LocalAccountFolders($this->app->make(Files::class)),
            $nobodyMayDrain,
        );

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

        new PrivateSignInProcesses(
            $host,
            $protocols,
            static fn () => null,
            $this->app->make(Files::class),
            new LocalAccountFolders($this->app->make(Files::class)),
            $stillRunning,
        )->cleanNext();

        $this->assertEquals([new CleanupProgress(false, false)], $host->cleanups);
        $this->assertDirectoryExists($directory);
        rmdir($directory);
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
        $runner = new PrivateSignInProcesses(
            $host,
            $protocols,
            static fn () => null,
            $this->app->make(Files::class),
            new LocalAccountFolders($this->app->make(Files::class)),
            $session,
        );

        $host->nextCleanup = $displaced;
        $runner->cleanNext();
        $this->assertDirectoryExists($directory);

        $session->isRunning = false;
        $host->nextCleanup = $displaced;
        $runner->cleanNext();

        $this->assertEquals([CleanupProgress::stillBound(), new CleanupProgress(true, true)], $host->cleanups);
        $this->assertDirectoryDoesNotExist($directory);
    }

    private function keepUsage(): void
    {
        $generation = $this->account->sign_in_generation;
        $source = UsageSource::of('start-1', 1, CarbonImmutable::now());
        $window = new UsageWindowReading('claude', UsageWindowSlot::SevenDay, 40.0, null, null, $source);
        $this->app->make(UsageReadings::class)->recordWindow($this->account, $generation, $window);
        $cost = new UsageCost('result-1', UsdAmount::from('1'), $source->observedAt);
        AccountUsageCost::create($this->account, $generation, $cost);
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

        return $this->journal->run($command);
    }

    private function asHost(Command $command): mixed
    {
        return $this->app->make(JournalCommands::class)->runAsJournal(
            CommandEntry::HostControl,
            'test host',
            $command,
        );
    }

    private function reconcile(): void
    {
        $this->app->make(JournalCommands::class)
            ->runAsJournal(CommandEntry::AccountMaintenance, 'account reconciliation', new ReconcileAccountsCommand());
    }

    private function startProcessOnAccount(): void
    {
        DB::table('session_processes')->insert([
            'id' => strtolower((string) Str::ulid()),
            'agent_id' => strtolower((string) Str::ulid()),
            'session_id' => strtolower((string) Str::ulid()),
            'start_key' => (string) Str::ulid(),
            'account_type' => Account::linkType(),
            'account_id' => $this->account->id,
            'account_generation' => $this->account->sign_in_generation,
            'directory' => (string) $this->account->directory,
            'status' => SessionProcessStatus::Running->value,
            'role' => AccountProcessRole::Execution->value,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
