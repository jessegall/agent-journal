<?php

declare(strict_types=1);

namespace App\Profiles\Models;

use App\Contracts\EventSource;
use App\Contracts\Support\RaisesEvents;
use App\Profiles\Enums\UsageWindowSlot;
use App\Profiles\Events\AccountUsageChanged;
use App\Profiles\Models\Concerns\KeepsNewestReading;
use App\Profiles\Models\Support\AccountOwnerScope;
use App\Profiles\Values\UsageWindowReading;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * The newest reading of one limit window of a saved account in one sign-in generation, such as Claude's seven-day
 * window: how much of it is used, how long it lasts, when it resets, and the observation that said so.
 *
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
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['account_id', 'sign_in_generation', 'limit_id', 'slot'])]
final class AccountUsageWindow extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use KeepsNewestReading;
    use RaisesEvents;

    // ----------[ Constructors ]----------

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

    /**
     * Keeps the reading as its window's newest in the account's current sign-in generation; a reading of an earlier
     * generation, or one no newer than the window holds, changes nothing.
     */
    public static function record(Account $account, int $generation, UsageWindowReading $reading): void
    {
        if (! $account->isGeneration($generation)) {
            return;
        }

        $window = self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->where('account_id', $account->id)
            ->where('sign_in_generation', $generation)
            ->where('limit_id', $reading->limitId)
            ->where('slot', $reading->slot->value)
            ->lockForUpdate()
            ->first();

        if ($window === null) {
            self::create($account, $generation, $reading);

            return;
        }

        $window->replaceWith($account->driver, $reading);
    }

    private static function create(Account $account, int $generation, UsageWindowReading $reading): void
    {
        $window = new self([
            'account_id' => $account->id,
            'sign_in_generation' => $generation,
            'limit_id' => $reading->limitId,
            'slot' => $reading->slot->value,
        ]);
        $window->fillWith($reading);
        $window->assertSaved($window->save());
        $window->raise(new AccountUsageChanged($account->driver, $account->id));
    }

    // ----------[ Queries ]----------

    /**
     * The windows of each account in its current sign-in generation, by account id.
     *
     * @param  list<Account>  $accounts
     * @return array<string, list<self>>
     */
    public static function currentOf(array $accounts): array
    {
        if ($accounts === []) {
            return [];
        }

        $windows = self::query()
            ->inCurrentGenerationOf($accounts)
            ->orderBy('account_id')
            ->orderBy('limit_id')
            ->orderBy('slot')
            ->readAll('an account holds a few windows of its current sign-in')
            ->get();
        $grouped = [];

        foreach ($windows as $window) {
            $grouped[$window->account_id][] = $window;
        }

        return $grouped;
    }

    // ----------[ Mutations ]----------

    /**
     * Replaces every field of the window with a newer reading, so a reset of an earlier reading never stays.
     */
    public function replaceWith(string $driver, UsageWindowReading $reading): void
    {
        if (! $reading->source->isNewerThan($this->heldSource())) {
            return;
        }

        $this->fillWith($reading);
        $this->assertSaved($this->save());
        $this->raise(new AccountUsageChanged($driver, $this->account_id));
    }

    /**
     * Deletes every window of the account, whose removal finished.
     */
    public static function forgetAccount(string $accountId): void
    {
        self::query()->withoutGlobalScope(AccountOwnerScope::class)->where('account_id', $accountId)->delete();
    }

    // ----------[ Internals ]----------

    private function fillWith(UsageWindowReading $reading): void
    {
        $this->used_percent = $reading->usedPercent;
        $this->duration_minutes = $reading->durationMinutes;
        $this->resets_at = $reading->resetsAt;
        $this->observed_at = $reading->source->observedAt;
        $this->source_id = $reading->source->id;
        $this->source_order = $reading->source->order;
    }
}
