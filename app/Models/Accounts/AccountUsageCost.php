<?php

declare(strict_types=1);

namespace App\Models\Accounts;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Accounts\AccountUsageChanged;
use App\Exceptions\UsageCostConflict;
use App\Models\Concerns\OfSignIn;
use App\Models\Concerns\RemovedWithAccount;
use App\Models\Support\AccountOwnerScope;
use App\Values\MonthCost;
use App\Values\UsageCost;
use App\Values\UsdAmount;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $account_id
 * @property int $sign_in_generation
 * @property string $source_id
 * @property string|float $usd
 * @property CarbonImmutable $observed_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 */
final class AccountUsageCost extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use OfSignIn;
    use RaisesEvents;
    use RemovedWithAccount;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sign_in_generation' => 'integer',
            'usd' => 'decimal:'.UsdAmount::MOST_DECIMALS,
            'observed_at' => 'immutable_datetime',
            'observations' => 'integer',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * Keeps the cost of a result once, in any generation of the account, so a late cost of an earlier sign-in still
     * counts; the same cost again changes nothing.
     *
     * @throws UsageCostConflict when the account holds another amount or time under the same source
     */
    public static function create(Account $account, int $generation, UsageCost $cost): void
    {
        $kept = self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->ofSignIn($account, $generation)
            ->fromSource($cost->sourceId)
            ->lockForUpdate()
            ->first();

        if ($kept !== null) {
            $kept->assertRecords($cost);

            return;
        }

        $entry = new self();
        $entry->account_id = $account->id;
        $entry->sign_in_generation = $generation;
        $entry->source_id = $cost->sourceId;
        $entry->usd = $cost->usd->amount;
        $entry->observed_at = $cost->observedTime();

        $entry->assertSaved($entry->save());
        $entry->raise(new AccountUsageChanged($account->account_protocol, $account->id));
    }

    // ----------[ Asserts ]----------

    /**
     * @throws UsageCostConflict
     */
    private function assertRecords(UsageCost $cost): void
    {
        if ($this->usd === $cost->usd->amount && $this->observed_at->getTimestamp() === $cost->observedAt) {
            return;
        }

        throw UsageCostConflict::for($cost->sourceId);
    }

    // ----------[ Internals ]----------

    private function monthCost(CarbonImmutable $start): MonthCost
    {
        return new MonthCost($start, UsdAmount::from($this->usd), $this->observations, $this->observed_at);
    }

    // ----------[ Queries ]----------

    /**
     * What each account cost in the UTC calendar month of the instant, across all its sign-ins, by account id; an
     * account with no cost observed that month is left out.
     *
     * @param  list<string>  $ids
     * @return array<string, MonthCost>
     */
    public static function monthTotals(array $ids, CarbonImmutable $instant): array
    {
        $monthStart = $instant->utc()->startOfMonth();

        $totals = self::query()
            ->ofAccounts($ids)
            ->observedInMonthOf($monthStart)
            ->totalPerAccount()
            ->readExactly(count($ids))
            ->get();

        $costs = [];

        foreach ($totals as $total) {
            $costs[$total->account_id] = $total->monthCost($monthStart);
        }

        return $costs;
    }

    // ----------[ Scopes ]----------

    /**
     * The cost the source reported.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function fromSource(Builder $query, string $sourceId): void
    {
        $query->where('source_id', $sourceId);
    }

    /**
     * The costs of the accounts.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $ids
     */
    #[Scope]
    protected function ofAccounts(Builder $query, array $ids): void
    {
        $query->whereIn('account_id', $ids);
    }

    /**
     * The costs observed in the month that starts then.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function observedInMonthOf(Builder $query, CarbonImmutable $monthStart): void
    {
        $query->where('observed_at', '>=', $monthStart)->where('observed_at', '<', $monthStart->addMonth());
    }

    /**
     * One row of each account's total: its cost, how many readings and the newest of them.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function totalPerAccount(Builder $query): void
    {
        $query->selectRaw('account_id, sum(usd) as usd, count(*) as observations, max(observed_at) as observed_at')
            ->groupBy('account_id');
    }
}
