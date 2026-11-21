<?php

declare(strict_types=1);

namespace App\Profiles\Models\Concerns;

use App\Profiles\Models\Account;
use App\Profiles\Values\UsageSource;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * A usage row that keeps only the newest reading of its account's sign-in generation: the source that reading came
 * from, and the scope that reads each account's current generation.
 *
 * @property string $account_id
 * @property int $sign_in_generation
 * @property CarbonImmutable $observed_at
 * @property string $source_id
 * @property int $source_order
 */
trait KeepsNewestReading
{
    private function heldSource(): UsageSource
    {
        return new UsageSource($this->source_id, $this->source_order, $this->observed_at);
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
