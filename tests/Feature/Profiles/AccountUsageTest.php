<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Drivers\Enums\HookDriver;
use App\Profiles\Enums\UsageWindowSlot;
use App\Profiles\Exceptions\UsageCostConflict;
use App\Profiles\Exceptions\UsdAmountInvalid;
use App\Profiles\Models\Account;
use App\Profiles\Models\AccountUsageCost;
use App\Profiles\Models\AccountUsageTokens;
use App\Profiles\Models\AccountUsageWindow;
use App\Profiles\Support\UsageReadings;
use App\Profiles\Values\AccountLabel;
use App\Profiles\Values\ThreadTokens;
use App\Profiles\Values\UsageCost;
use App\Profiles\Values\UsageSource;
use App\Profiles\Values\UsageWindowReading;
use App\Profiles\Values\UsdAmount;
use Carbon\CarbonImmutable;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A saved account keeps the newest reading of each limit window of its current sign-in, every result's cost once,
 * and the latest token count of each thread; replays change nothing and a conflicting cost is refused. The owner
 * reads them.
 */
final class AccountUsageTest extends TestCase
{
    use RefreshHookDatabase;

    private const string RESET_TIME = '2026-11-30 23:59:59';

    private Account $account;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
        $this->account = Account::create(HookDriver::ClaudeCode, AccountLabel::from('Work'), '/journal/accounts/work');
    }

    public function test_a_newer_window_replaces_every_field_and_an_older_or_replayed_one_changes_nothing(): void
    {
        $this->recordWindow(UsageWindowSlot::SevenDay, 40.0, '2026-11-24T10:00:00Z', 1);
        $this->recordWindow(UsageWindowSlot::FiveHour, 10.0, '2026-11-21T15:00:00Z', 2);

        $this->recordWindow(UsageWindowSlot::SevenDay, 40.0, '2026-11-24T10:00:00Z', 1);
        $this->recordWindow(UsageWindowSlot::SevenDay, 99.0, '2026-11-24T10:00:00Z', 0);
        $this->assertSame(40.0, $this->windowOf(UsageWindowSlot::SevenDay)->used_percent);

        $this->recordWindow(UsageWindowSlot::SevenDay, 42.5, null, 3);

        $windows = AccountUsageWindow::query()->withoutGlobalScopes()->orderBy('slot')->get();
        $slots = [$windows[0]->slot, $windows[1]->slot];
        $this->assertSame([UsageWindowSlot::FiveHour, UsageWindowSlot::SevenDay], $slots);
        $this->assertSame([10.0, 42.5], [$windows[0]->used_percent, $windows[1]->used_percent]);
        $this->assertNotNull($windows[0]->resets_at);
        $this->assertNull($windows[1]->resets_at);
    }

    public function test_a_window_of_an_earlier_sign_in_generation_is_ignored(): void
    {
        $reading = $this->window(UsageWindowSlot::SevenDay, 40.0, null, 1);

        $earlier = $this->account->sign_in_generation - 1;
        $this->app->make(UsageReadings::class)->recordWindow($this->account, $earlier, $reading);

        $this->assertSame(0, AccountUsageWindow::query()->withoutGlobalScopes()->count());
    }

    public function test_a_cost_is_kept_once_and_a_different_cost_under_its_source_is_refused(): void
    {
        $observedAt = CarbonImmutable::parse('2026-11-21T10:00:00.250Z');
        $cost = UsageCost::of('result-1', UsdAmount::from('0.0128'), $observedAt);
        AccountUsageCost::add($this->account, 1, $cost);
        AccountUsageCost::add($this->account, 1, $cost);

        $kept = AccountUsageCost::query()->withoutGlobalScopes()->sole();
        $this->assertSame('0.012800000000', $kept->usd);
        $this->assertSame('2026-11-21T10:00:00+00:00', $kept->observed_at->utc()->toIso8601String());

        $this->expectException(UsageCostConflict::class);
        AccountUsageCost::add($this->account, 1, new UsageCost('result-1', UsdAmount::from('0.5'), $cost->observedAt));
    }

    public function test_a_dollar_amount_with_more_than_twelve_decimals_or_a_sign_is_refused(): void
    {
        $this->assertSame('3.420000000000', UsdAmount::from('3.42')->amount);

        $this->expectException(UsdAmountInvalid::class);
        UsdAmount::from('0.0000000000001');
    }

    public function test_month_totals_sum_each_accounts_costs_of_the_utc_month_across_sign_ins(): void
    {
        $other = Account::create(HookDriver::ClaudeCode, AccountLabel::from('Home'), '/journal/accounts/home');
        $this->addCost($this->account, 1, 'a', '1.25', '2026-11-01T00:00:00Z');
        $this->addCost($this->account, 2, 'b', '0.75', '2026-11-30T23:59:59Z');
        $this->addCost($this->account, 1, 'c', '9', '2026-10-31T23:59:59Z');
        $this->addCost($other, 1, 'd', '0', '2026-11-10T00:00:00Z');

        $totals = AccountUsageCost::monthTotals(
            [$this->account->id, $other->id],
            CarbonImmutable::parse('2026-11-21T12:00:00Z'),
        );

        $this->assertSame('2.000000000000', $totals[$this->account->id]->usd->amount);
        $this->assertSame(2, $totals[$this->account->id]->observations);
        $lastObservedAt = $totals[$this->account->id]->lastObservedAt;
        $this->assertSame(self::RESET_TIME, $lastObservedAt->utc()->toDateTimeString());
        $this->assertSame(['0.000000000000', 1], [$totals[$other->id]->usd->amount, $totals[$other->id]->observations]);
    }

    public function test_a_thread_count_is_replaced_never_added_and_the_newest_thread_is_read(): void
    {
        $this->recordTokens('thread-a', 1000, '2026-11-21T10:00:00Z');
        $this->recordTokens('thread-a', 1500, '2026-11-21T10:05:00Z');
        $this->recordTokens('thread-a', 900, '2026-11-21T10:01:00Z');
        $this->recordTokens('thread-b', 300, '2026-11-21T09:00:00Z');

        $newest = AccountUsageTokens::newestOf([$this->account->refresh()]);

        $snapshot = $newest[$this->account->id];
        $this->assertSame(['thread-a', 1500], [$snapshot->thread_id, $snapshot->total]);
        $this->assertSame(2, AccountUsageTokens::query()->withoutGlobalScopes()->count());
    }

    private function windowOf(UsageWindowSlot $slot): AccountUsageWindow
    {
        return AccountUsageWindow::query()->withoutGlobalScopes()->where('slot', $slot->value)->sole();
    }

    private function recordWindow(UsageWindowSlot $slot, float $percent, string|null $reset, int $order): void
    {
        $reading = $this->window($slot, $percent, $reset, $order);
        $this->app->make(UsageReadings::class)->recordWindow($this->account, 1, $reading);
    }

    private function window(UsageWindowSlot $slot, float $percent, string|null $reset, int $order): UsageWindowReading
    {
        $resetsAt = $reset === null ? null : CarbonImmutable::parse($reset)->getTimestamp();
        $observedAt = CarbonImmutable::parse('2026-11-21T10:00:00Z')->addMinutes($order);
        $source = UsageSource::of('start-1', $order, $observedAt);

        return new UsageWindowReading('claude', $slot, $percent, null, $resetsAt, $source);
    }

    private function addCost(Account $account, int $generation, string $source, string $usd, string $at): void
    {
        $cost = UsageCost::of($source, UsdAmount::from($usd), CarbonImmutable::parse($at));
        AccountUsageCost::add($account, $generation, $cost);
    }

    private function recordTokens(string $thread, int $total, string $at): void
    {
        $source = UsageSource::of('owner-1', 1, CarbonImmutable::parse($at));
        $tokens = new ThreadTokens($thread, $total, null, null, null, null, null, $source);

        $this->app->make(UsageReadings::class)->recordTokens($this->account, 1, $tokens);
    }
}
