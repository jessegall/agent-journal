<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\ClaimCleanup\ClaimCleanupCommand;
use App\Commands\Accounts\CleanAccount\CleanAccountCommand;
use App\Commands\Accounts\ReconcileAccounts\ReconcileAccountsCommand;
use App\Commands\Accounts\RemoveAccount\RemoveAccountCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Enums\Accounts\AccountProcessRole;
use App\Enums\Accounts\CleanupTarget;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Accounts\UsageWindowSlot;
use App\Enums\Agents\SessionProcessStatus;
use App\Jobs\SignInDeadline;
use App\Models\Accounts\Account;
use App\Models\Accounts\AccountUsageCost;
use App\Models\Accounts\AccountUsageWindow;
use App\Support\ActorReference;
use App\Support\Command;
use App\Support\JournalCommands;
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
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A host claims the next cleanup that is due: nothing while a removed account still runs a process, then the account
 * once its processes ended.
 */
#[TimeLimit(seconds: 4, reason: 'It commits accounts, attempts and starts through the bus and empties seven tables.')]
#[TestsCommand(ClaimCleanupCommand::class)]
final class ClaimCleanupTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

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

    public function test_a_removed_account_is_claimed_for_cleanup_only_once_its_processes_ended(): void
    {
        $this->startProcessOnAccount();
        $this->asOwner(new RemoveAccountCommand($this->account->id));
        $this->reconcile();

        $this->assertNull($this->asHost(new ClaimCleanupCommand('host')));

        DB::table('session_processes')->update(['status' => SessionProcessStatus::Stopped->value]);
        $this->reconcile();
        $claimed = $this->asHost(new ClaimCleanupCommand('host'));

        $this->assertInstanceOf(ClaimedCleanup::class, $claimed);
        $this->assertSame([CleanupTarget::Account, $this->account->id], [$claimed->target, $claimed->id]);
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
            ActorReference::forUser(TestIds::of(1)),
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
