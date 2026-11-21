<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Drivers\Enums\HookDriver;
use App\Http\Data\Profiles\AccountMonthCostData;
use App\Http\Data\Profiles\AccountRowData;
use App\Http\Data\Profiles\AccountThreadTokensData;
use App\Http\Data\Profiles\AccountUsageData;
use App\Profiles\Enums\UsageWindowSlot;
use App\Profiles\Models\Account;
use App\Profiles\Models\AccountUsageCost;
use App\Profiles\Resolvers\AccountsWindowResolver;
use App\Profiles\Support\UsageReadings;
use App\Profiles\Values\AccountLabel;
use App\Profiles\Values\ThreadTokens;
use App\Profiles\Values\UsageCost;
use App\Profiles\Values\UsageSource;
use App\Profiles\Values\UsageWindowReading;
use App\Profiles\Values\UsdAmount;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Spatie\LaravelData\Optional;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * Each row of the Accounts page carries the usage its account's programs reported, read for all rows in three
 * grouped queries, and no usage at all for an account without a reading.
 */
final class AccountsUsageRowTest extends TestCase
{
    use RefreshHookDatabase;
    use WithActiveAccount;

    /**
     * @var array<string, Account>
     */
    private array $accounts;

    protected function setUp(): void
    {
        parent::setUp();

        CarbonImmutable::setTestNow('2026-11-21T12:00:00Z');
        $this->accounts = $this->chooseActiveAccounts();
    }

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();

        parent::tearDown();
    }

    public function test_an_account_without_a_reading_has_no_usage(): void
    {
        $rows = $this->app->make(AccountsWindowResolver::class)->read()->rows;

        $this->assertCount(2, $rows);

        foreach ($rows as $row) {
            $this->assertInstanceOf(Optional::class, $row->usage);
            $this->assertArrayNotHasKey('usage', $row->toArray());
        }
    }

    public function test_an_account_with_readings_carries_them_on_its_row(): void
    {
        $account = $this->accounts['claude-code'];
        $source = UsageSource::of('start-1', 1, CarbonImmutable::parse('2026-11-21T10:00:00Z'));
        $resetsAt = CarbonImmutable::parse('2026-11-24T10:00:00Z')->getTimestamp();
        $window = new UsageWindowReading('claude', UsageWindowSlot::SevenDay, 42.0, 10080, $resetsAt, $source);
        $this->app->make(UsageReadings::class)->recordWindow($account, 1, $window);
        AccountUsageCost::add($account, 1, new UsageCost('result-1', UsdAmount::from('3.42'), $source->observedAt));
        $tokens = new ThreadTokens('thread-1', 8240, 8000, null, 240, null, 120, $source);
        $this->app->make(UsageReadings::class)->recordTokens($account, 1, $tokens);

        $usage = $this->rowOf($account->id)->usage;

        $this->assertInstanceOf(AccountUsageData::class, $usage);
        $this->assertSame(UsageWindowSlot::SevenDay, $usage->windows[0]->slot);
        $this->assertSame([42.0, 10080], [$usage->windows[0]->usedPercent, $usage->windows[0]->windowMinutes]);
        $this->assertSame('2026-11-24T10:00:00+00:00', $usage->windows[0]->resetsAt);
        $cost = $usage->monthCost;
        $this->assertInstanceOf(AccountMonthCostData::class, $cost);
        $this->assertSame(['3.420000000000', 1], [$cost->usd, $cost->observations]);
        $this->assertSame('2026-11-01T00:00:00+00:00', $cost->monthStart);
        $thread = $usage->latestThread;
        $this->assertInstanceOf(AccountThreadTokensData::class, $thread);
        $this->assertSame([8240, null, 120], [$thread->total, $thread->cachedInput, $thread->lastTurnTotal]);
        $this->assertInstanceOf(Optional::class, $this->rowOf($this->accounts['codex']->id)->usage);
    }

    public function test_usage_is_read_in_three_queries_however_many_accounts_are_listed(): void
    {
        $this->assertSame(3, $this->usageQueriesOfOneRead());

        foreach (['Home', 'Spare', 'Travel'] as $label) {
            Account::create(HookDriver::Codex, AccountLabel::from($label), '/journal/accounts/'.strtolower($label));
        }

        $this->assertSame(3, $this->usageQueriesOfOneRead());
    }

    private function rowOf(string $accountId): AccountRowData
    {
        $rows = $this->app->make(AccountsWindowResolver::class)->read()->rows;

        return array_values(array_filter($rows, fn (AccountRowData $row) => $row->id === $accountId))[0];
    }

    private function usageQueriesOfOneRead(): int
    {
        DB::flushQueryLog();
        DB::enableQueryLog();
        $this->app->make(AccountsWindowResolver::class)->read();
        $isUsage = fn (array $query) => str_contains($query['query'], 'account_usage_');
        $queries = array_filter(DB::getQueryLog(), $isUsage);
        DB::disableQueryLog();

        return count($queries);
    }
}
