<?php

declare(strict_types=1);

namespace App\Models\Concerns;

use App\Events\Accounts\AccountUsageChanged;
use App\Models\Accounts\Account;
use App\Values\UsageSource;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * A usage row that keeps only the newest reading of its account's sign-in generation: whether a reading is newer
 * than the one it holds, saving a new one, and the scope that reads each account's current generation.
 *
 * @property string $account_id
 * @property int $sign_in_generation
 * @property CarbonImmutable $observed_at
 * @property string $source_id
 * @property int $source_order
 */
trait KeepsNewestReading
{
    /**
     * Whether the reading the row holds is older than one from the given source, so that one replaces it.
     */
    public function isOlderThan(UsageSource $source): bool
    {
        $held = new UsageSource($this->source_id, $this->source_order, $this->observed_at->getTimestamp());

        return $source->isNewerThan($held);
    }

    /**
     * Saves the row with its new reading and says the account's usage changed.
     */
    private function saveReading(string $driver): void
    {
        $this->saveAndAssert();
        $this->raise(new AccountUsageChanged($driver, $this->account_id));
    }

    /**
     * @param  Builder<self>  $query
     * @param  list<Account>  $accounts
     */
    #[Scope]
    protected function inCurrentGenerationOf(Builder $query, array $accounts): void
    {
        $query->where(function (Builder $any) use ($accounts) {
            foreach ($accounts as $account) {
                $any->orWhere(fn (Builder $one) => $one
                    ->where('account_id', $account->id)
                    ->where('sign_in_generation', $account->sign_in_generation));
            }
        });
    }
}
