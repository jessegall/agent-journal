<?php

declare(strict_types=1);

namespace Tests\Commands\Accounts;

use App\Commands\Accounts\AddUsageCost\AddUsageCostCommand;
use App\Enums\Accounts\AccountProcessRole;
use App\Enums\Agents\SessionProcessStatus;
use App\Events\Accounts\AccountsChanged;
use App\Events\Accounts\AccountUsageChanged;
use App\Exceptions\AccountMissing;
use App\Exceptions\SessionProcessUnknown;
use App\Exceptions\UsageCostConflict;
use App\Models\Accounts\Account;
use App\Models\Accounts\AccountUsageCost;
use App\Support\DefaultDrivers;
use App\Support\EnrolledHost;
use App\Values\AccountLabel;
use App\Values\ReportedStart;
use App\Values\UsageCost;
use App\Values\UsdAmount;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A host's reported cost lands under the saved account of the start that host claimed, never under an account the
 * report names: another host's start is refused, a retry keeps one cost, and a removed account takes none.
 */
#[TimeLimit(seconds: 4, reason: 'It enrolls hosts and empties several tables.')]
#[TestsCommand(AddUsageCostCommand::class)]
final class AddUsageCostTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

    private const array TABLES = [
        'account_usage_windows',
        'account_usage_costs',
        'account_usage_tokens',
        'session_processes',
        'active_accounts',
        'accounts',
        'hosts',
        'command_receipts',
        'links',
    ];

    private EnrolledHost $host;

    private Account $account;

    protected function setUp(): void
    {
        parent::setUp();

        $this->account = $this->chooseActiveAccounts()['claude-code'];
        $this->host = $this->journal->enrolledHost();
    }

    public function test_costs_on_two_accounts_of_one_program_land_under_each_start_account(): void
    {
        $other = Account::create(DefaultDrivers::CLAUDE_CODE, AccountLabel::from('Home'), '/journal/accounts/home');
        $first = $this->claimedStart($this->account);
        $second = $this->claimedStart($other);

        $this->addCost($first, 'result-1', '0.25');
        $this->addCost($second, 'result-2', '0.5');

        $this->assertEqualsCanonicalizing(
            [$this->account->id, $other->id],
            AccountUsageCost::query()->withoutGlobalScopes()->pluck('account_id')->all(),
        );
    }

    public function test_a_start_of_another_host_is_refused_and_nothing_is_written(): void
    {
        $key = $this->claimedStart($this->account);
        $stranger = $this->journal->enrolledHost();

        $this->assertThrows(fn () => $this->addCost($key, 'result-1', '1', $stranger), SessionProcessUnknown::class);

        $this->assertSame(0, AccountUsageCost::query()->withoutGlobalScopes()->count());
    }

    public function test_an_identical_retry_keeps_one_cost_and_another_amount_conflicts(): void
    {
        $key = $this->claimedStart($this->account);
        Event::fake([AccountUsageChanged::class]);
        $this->addCost($key, 'result-1', '0.5');

        $this->addCost($key, 'result-1', '0.5');
        $this->assertThrows(fn () => $this->addCost($key, 'result-1', '0.6'), UsageCostConflict::class);

        Event::assertDispatchedTimes(AccountUsageChanged::class, 1);
        $this->assertSame(1, AccountUsageCost::query()->withoutGlobalScopes()->count());
    }

    public function test_a_committed_cost_refreshes_the_accounts_page_once_and_a_duplicate_not_at_all(): void
    {
        $key = $this->claimedStart($this->account);
        Event::fake([AccountsChanged::class]);

        $this->addCost($key, 'result-1', '0.5');
        $this->addCost($key, 'result-1', '0.5');

        Event::assertDispatchedTimes(AccountsChanged::class, 1);
        Event::assertDispatched(
            AccountsChanged::class,
            fn (AccountsChanged $changed) => $changed->accountId === $this->account->id,
        );
    }

    public function test_a_cost_from_a_stopped_start_of_an_earlier_sign_in_still_counts_for_its_account(): void
    {
        $key = $this->claimedStart($this->account, SessionProcessStatus::Stopped);
        DB::table('accounts')->where('id', $this->account->id)->increment('sign_in_generation');

        $this->addCost($key, 'result-1', '2');

        $cost = AccountUsageCost::query()->withoutGlobalScopes()->sole();
        $this->assertSame([$this->account->id, 1], [$cost->account_id, $cost->sign_in_generation]);
    }

    public function test_a_cost_on_a_removed_account_is_refused_and_writes_nothing(): void
    {
        $key = $this->claimedStart($this->account);
        DB::table('accounts')->where('id', $this->account->id)->update(['status' => 'removed']);

        $this->assertThrows(fn () => $this->addCost($key, 'result-1', '1'), AccountMissing::class);

        $this->assertSame(0, AccountUsageCost::query()->withoutGlobalScopes()->count());
    }

    private function addCost(string $key, string $source, string $usd, EnrolledHost|null $host = null): void
    {
        $this->journal->asSystem(new AddUsageCostCommand(
            new ReportedStart(($host ?? $this->host)->hostId, $key, 1),
            UsageCost::of($source, UsdAmount::from($usd), CarbonImmutable::parse('2026-11-21T10:00:00Z')),
        ));
    }

    private function claimedStart(Account $account, SessionProcessStatus $state = SessionProcessStatus::Running): string
    {
        $key = (string) Str::ulid();
        DB::table('session_processes')->insert([
            'id' => strtolower((string) Str::ulid()),
            'agent_id' => strtolower((string) Str::ulid()),
            'session_id' => strtolower((string) Str::ulid()),
            'host_id' => $this->host->hostId,
            'start_key' => $key,
            'account_type' => Account::linkType(),
            'account_id' => $account->id,
            'account_generation' => 1,
            'directory' => (string) $account->directory,
            'status' => $state->value,
            'role' => AccountProcessRole::Execution->value,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return $key;
    }
}
