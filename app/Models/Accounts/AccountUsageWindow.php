<?php

declare(strict_types=1);

namespace App\Models\Accounts;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\Accounts\UsageWindowSlot;
use App\Events\Accounts\AccountUsageChanged;
use App\Models\Concerns\KeepsNewestReading;
use App\Models\Concerns\OfSignIn;
use App\Models\Concerns\RemovedWithAccount;
use App\Models\Support\AccountOwnerScope;
use App\Models\Support\JournalModel;
use App\Values\UsageWindowReading;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property string $id
 * @property string $account_id
 * @property int $sign_in_generation
 * @property string $limit_id
 * @property UsageWindowSlot $slot
 * @property float|null $used_percent
 * @property int|null $duration_minutes
 * @property CarbonImmutable|null $resets_at
 * @property CarbonImmutable $observed_at
 * @property string $source_id
 * @property int $source_order
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class AccountUsageWindow extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use KeepsNewestReading;
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
            'slot' => UsageWindowSlot::class,
            'used_percent' => 'float',
            'duration_minutes' => 'integer',
            'resets_at' => 'immutable_datetime',
            'observed_at' => 'immutable_datetime',
            'source_order' => 'integer',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A new window of the account in the generation, holding its first reading.
     */
    public static function create(Account $account, int $generation, UsageWindowReading $reading): void
    {
        $window = new self();
        $window->account_id = $account->id;
        $window->sign_in_generation = $generation;
        $window->limit_id = $reading->limitId;
        $window->slot = $reading->slot;

        $window->fillWith($reading);
        $window->saveAndAssert();
        $window->raise(new AccountUsageChanged($account->account_protocol, $account->id));
    }

    // ----------[ Mutations ]----------

    /**
     * Replaces every field of the window with a newer reading, so a reset of an earlier reading never stays.
     */
    public function replaceWith(string $driver, UsageWindowReading $reading): void
    {
        $this->fillWith($reading);
        $this->saveReading($driver);
    }

    // ----------[ Internals ]----------

    private function fillWith(UsageWindowReading $reading): void
    {
        $this->used_percent = $reading->usedPercent;
        $this->duration_minutes = $reading->durationMinutes;
        $this->resets_at = $reading->resetTime();
        $this->observed_at = $reading->source->observedTime();
        $this->source_id = $reading->source->id;
        $this->source_order = $reading->source->order;
    }

    // ----------[ Queries ]----------

    /**
     * The account's window of the reading's limit and slot in the generation, locked; none before its first reading.
     */
    public static function findLockedFor(Account $account, int $generation, UsageWindowReading $reading): self|null
    {
        return self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->ofSignIn($account, $generation)
            ->forReading($reading)
            ->lockForUpdate()
            ->first();
    }

    /**
     * The windows of each account in its current sign-in generation, by account id.
     *
     * @param  list<Account>  $accounts
     * @return array<string, list<self>>
     */
    public static function findCurrentOf(array $accounts): array
    {
        if ($accounts === []) {
            return [];
        }

        $windows = self::query()
            ->inCurrentGenerationOf($accounts)
            ->inWindowOrder()
            ->readAll('an account holds a few windows of its current sign-in')
            ->get();

        $grouped = [];

        foreach ($windows as $window) {
            $grouped[$window->account_id][] = $window;
        }

        return $grouped;
    }

    // ----------[ Scopes ]----------

    /**
     * The window of the reading's limit and slot.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forReading(Builder $query, UsageWindowReading $reading): void
    {
        $query->where('limit_id', $reading->limitId)->where('slot', $reading->slot->value);
    }

    /**
     * The windows by account, then limit, then slot.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inWindowOrder(Builder $query): void
    {
        $query->orderBy('account_id')->orderBy('limit_id')->orderBy('slot');
    }
}
