<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Enums\AccountProcessRole;
use App\Enums\ProcessStartState;
use App\Events\Accounts\AccountsChanged;
use App\Events\Accounts\AccountUsageChanged;
use App\Models\Accounts\Account;
use App\Models\Accounts\AccountUsageCost;
use App\Models\Accounts\AccountUsageWindow;
use App\Support\DefaultDrivers;
use App\Support\EnrolledHost;
use App\Values\AccountLabel;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A host's usage report lands under the saved account of the start that host claimed, never under an account the
 * report names: another host is refused, a retry is acknowledged once more, and a removed account takes none.
 */
#[TimeLimit(seconds: 4, reason: 'It enrolls hosts and sends signed calls, emptying several tables.')]
final class UsageReportTest extends TestCase
{
    use CommitsHookRows;
    use RunsTrustedCommands;
    use SendsHostCalls;
    use WithActiveAccount;

    private const array TABLES = [
        'account_usage_windows',
        'account_usage_costs',
        'account_usage_tokens',
        'process_starts',
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
        $this->host = $this->enrolledHost();
    }

    public function test_reports_on_two_accounts_of_one_program_land_under_each_start_account(): void
    {
        $other = Account::create(DefaultDrivers::CLAUDE_CODE, AccountLabel::from('Home'), '/journal/accounts/home');
        $first = $this->claimedStart($this->account);
        $second = $this->claimedStart($other);

        $this->notify($first, 'result-1', ['type' => 'result_cost', 'usd' => '0.25'])->assertNoContent();
        $this->notify($second, 'window-1', [
            'type' => 'window',
            'limit_id' => 'claude',
            'slot' => 'seven_day',
            'used_percent' => 42,
            'resets_at' => '2026-11-24T10:00:00Z',
        ])->assertNoContent();

        $this->assertSame($this->account->id, AccountUsageCost::query()->withoutGlobalScopes()->sole()->account_id);
        $window = AccountUsageWindow::query()->withoutGlobalScopes()->sole();
        $this->assertSame([$other->id, 42.0], [$window->account_id, $window->used_percent]);
    }

    public function test_an_unrelated_host_is_refused_and_nothing_is_written(): void
    {
        $key = $this->claimedStart($this->account);
        $stranger = $this->enrolledHost();

        $answer = $this->notify($key, 'result-1', ['type' => 'result_cost', 'usd' => '1'], $stranger);

        $answer->assertNotFound();
        $this->assertStringNotContainsString($this->account->id, (string) $answer->getContent());
        $this->assertSame(0, AccountUsageCost::query()->withoutGlobalScopes()->count());
    }

    public function test_an_identical_retry_is_acknowledged_again_and_keeps_one_cost(): void
    {
        $key = $this->claimedStart($this->account);
        Event::fake([AccountUsageChanged::class]);
        $this->notify($key, 'result-1', ['type' => 'result_cost', 'usd' => '0.5'])->assertNoContent();
        Event::assertDispatchedTimes(AccountUsageChanged::class, 1);

        $this->notify($key, 'result-1', ['type' => 'result_cost', 'usd' => '0.5'])->assertNoContent();
        $this->notify($key, 'result-1', ['type' => 'result_cost', 'usd' => '0.6'])->assertConflict();

        Event::assertDispatchedTimes(AccountUsageChanged::class, 1);
        $this->assertSame(1, AccountUsageCost::query()->withoutGlobalScopes()->count());
    }

    public function test_a_committed_report_refreshes_the_accounts_page_once_and_a_duplicate_not_at_all(): void
    {
        $key = $this->claimedStart($this->account);
        Event::fake([AccountsChanged::class]);

        $this->notify($key, 'result-1', ['type' => 'result_cost', 'usd' => '0.5'])->assertNoContent();
        $this->notify($key, 'result-1', ['type' => 'result_cost', 'usd' => '0.5'])->assertNoContent();

        Event::assertDispatchedTimes(AccountsChanged::class, 1);
        Event::assertDispatched(
            AccountsChanged::class,
            fn (AccountsChanged $changed) => $changed->accountId === $this->account->id,
        );
    }

    public function test_a_cost_from_a_stopped_start_of_an_earlier_sign_in_still_counts_for_its_account(): void
    {
        $key = $this->claimedStart($this->account, ProcessStartState::Stopped);
        DB::table('accounts')->where('id', $this->account->id)->increment('sign_in_generation');

        $this->notify($key, 'result-1', ['type' => 'result_cost', 'usd' => '2'])->assertNoContent();
        $this->notify($key, 'window-1', ['type' => 'window', 'limit_id' => 'claude', 'slot' => 'five_hour'])
            ->assertNoContent();

        $cost = AccountUsageCost::query()->withoutGlobalScopes()->sole();
        $this->assertSame([$this->account->id, 1], [$cost->account_id, $cost->sign_in_generation]);
        $this->assertSame(0, AccountUsageWindow::query()->withoutGlobalScopes()->count());
    }

    public function test_a_report_on_a_removed_account_is_refused_and_writes_nothing(): void
    {
        $key = $this->claimedStart($this->account);
        DB::table('accounts')->where('id', $this->account->id)->update(['state' => 'removed']);

        $this->notify($key, 'result-1', ['type' => 'result_cost', 'usd' => '1'])->assertNotFound();

        $this->assertSame(0, AccountUsageCost::query()->withoutGlobalScopes()->count());
    }

    public function test_a_malformed_or_future_report_is_refused(): void
    {
        $key = $this->claimedStart($this->account);

        $this->notify($key, 'result-1', ['type' => 'result_cost', 'usd' => '0.0000000000001'])->assertUnprocessable();
        $this->notify($key, 'result-2', ['type' => 'window', 'limit_id' => 'claude', 'slot' => 'week'])
            ->assertUnprocessable();
        $future = CarbonImmutable::now()->addHour()->toAtomString();
        $this->notify($key, 'result-3', ['type' => 'result_cost', 'usd' => '1'], observedAt: $future)
            ->assertUnprocessable();

        $this->assertSame(0, AccountUsageCost::query()->withoutGlobalScopes()->count());
    }

    /**
     * @param  array<string, mixed>  $measurement
     */
    private function notify(
        string $key,
        string $source,
        array $measurement,
        EnrolledHost|null $host = null,
        string $observedAt = '2026-11-21T10:00:00Z',
    ): TestResponse {
        return $this->hostCall($host ?? $this->host, '/host/reports/usage', [
            'start_key' => $key,
            'generation' => 1,
            'source_id' => $source,
            'source_order' => 1,
            'observed_at' => $observedAt,
            'measurement' => $measurement,
        ]);
    }

    private function claimedStart(Account $account, ProcessStartState $state = ProcessStartState::Running): string
    {
        $key = (string) Str::ulid();
        DB::table('process_starts')->insert([
            'id' => strtolower((string) Str::ulid()),
            'agent_id' => strtolower((string) Str::ulid()),
            'session_id' => strtolower((string) Str::ulid()),
            'host_id' => $this->host->hostId,
            'start_key' => $key,
            'account_type' => Account::linkType(),
            'account_id' => $account->id,
            'account_generation' => 1,
            'directory' => (string) $account->directory,
            'state' => $state->value,
            'role' => AccountProcessRole::Execution->value,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return $key;
    }
}
