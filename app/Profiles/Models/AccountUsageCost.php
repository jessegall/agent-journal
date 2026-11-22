<?php

declare(strict_types=1);

namespace App\Profiles\Models;

use App\Contracts\EventSource;
use App\Contracts\Support\RaisesEvents;
use App\Links\Support\Linkable;
use App\Profiles\Events\AccountUsageChanged;
use App\Profiles\Exceptions\UsageCostConflict;
use App\Profiles\Models\Concerns\RemovedWithAccount;
use App\Profiles\Models\Support\AccountOwnerScope;
use App\Profiles\Values\MonthCost;
use App\Profiles\Values\UsageCost;
use App\Profiles\Values\UsdAmount;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * The estimated cost of one result a driver reported on a saved account, kept once and never changed: the
 * generation it ran in, the source that identifies the result, the amount in US dollars and when it was observed.
 *
 * @property string $id
 * @property string $account_id
 * @property int $sign_in_generation
 * @property string $source_id
 * @property string $usd
 * @property CarbonImmutable $observed_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read int $observations how many costs a month total sums, read only by monthTotals()
 */
#[Fillable(['account_id', 'sign_in_generation', 'source_id', 'usd', 'observed_at'])]
final class AccountUsageCost extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;
    use RemovedWithAccount;

    // ----------[ Constructors ]----------

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

    /**
     * Keeps the cost of a result once, in any generation of the account, so a late cost of an earlier sign-in still
     * counts; the same cost again changes nothing.
     *
     * @throws UsageCostConflict when the account holds another amount or time under the same source
     */
    public static function add(Account $account, int $generation, UsageCost $cost): void
    {
        $kept = self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->where('account_id', $account->id)
            ->where('sign_in_generation', $generation)
            ->where('source_id', $cost->sourceId)
            ->lockForUpdate()
            ->first();

        if ($kept !== null) {
            $kept->assertRecords($cost);

            return;
        }

        $entry = new self([
            'account_id' => $account->id,
            'sign_in_generation' => $generation,
            'source_id' => $cost->sourceId,
            'usd' => $cost->usd->amount,
            'observed_at' => $cost->observedTime(),
        ]);

        $entry->assertSaved($entry->save());
        $entry->raise(new AccountUsageChanged($account->driver, $account->id));
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
            ->whereIn('account_id', $ids)
            ->where('observed_at', '>=', $monthStart)
            ->where('observed_at', '<', $monthStart->addMonth())
            ->selectRaw('account_id, sum(usd) as usd, count(*) as observations, max(observed_at) as observed_at')
            ->groupBy('account_id')
            ->readExactly(count($ids))
            ->get();

        $costs = [];

        foreach ($totals as $total) {
            $costs[$total->account_id] = $total->monthCost($monthStart);
        }

        return $costs;
    }

    // ----------[ Internals ]----------

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

    private function monthCost(CarbonImmutable $start): MonthCost
    {
        return new MonthCost($start, UsdAmount::from($this->usd), $this->observations, $this->observed_at);
    }
}
