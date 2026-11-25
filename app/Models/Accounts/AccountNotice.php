<?php

declare(strict_types=1);

namespace App\Models\Accounts;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\AccountNoticeReason;
use App\Events\Accounts\AccountNoticeRecorded;
use App\Events\Accounts\AccountNoticeResolved;
use App\Models\Support\AccountOwnerScope;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $driver
 * @property AccountNoticeReason $reason
 * @property int $times
 * @property ?CarbonImmutable $resolved_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 */
#[Fillable([
    'driver',
    'reason',
])]
final class AccountNotice extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'reason' => AccountNoticeReason::class,
            'times' => 'integer',
            'resolved_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * A new open notice of the driver and reason, counted once.
     */
    public static function create(string $driver, AccountNoticeReason $reason): self
    {
        $notice = new self([
            'driver' => $driver,
            'reason' => $reason->value,
        ]);
        $notice->assertSaved($notice->save());
        $notice->raise(new AccountNoticeRecorded($notice->driver, $notice->id));

        return $notice;
    }

    // ----------[ Mutations ]----------

    /**
     * Counts the notice once more: it happened again while it was open.
     */
    public function countAgain(): void
    {
        $this->times++;
        $this->assertSaved($this->save());
        $this->raise(new AccountNoticeRecorded($this->driver, $this->id));
    }

    /**
     * Closes the notice: the owner dismissed it, or the driver's accounts work again.
     */
    public function resolveAt(CarbonImmutable $now): void
    {
        $this->resolved_at = $now;
        $this->assertSaved($this->save());
        $this->raise(new AccountNoticeResolved($this->driver, $this->id));
    }

    // ----------[ Queries ]----------

    /**
     * The driver's open notice of the reason, locked, if one is open.
     */
    public static function lockedOpenFor(string $driver, AccountNoticeReason $reason): self|null
    {
        return self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->open()
            ->ofDriver($driver)
            ->forReason($reason)
            ->lockForUpdate()
            ->first();
    }

    /**
     * The driver's open notices, locked in the order of their ids.
     *
     * @return list<self>
     */
    public static function lockedOpenOf(string $driver): array
    {
        $notices = self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->open()
            ->ofDriver($driver)
            ->oldestFirst()
            ->lockForUpdate()
            ->readAll('a driver keeps one open notice per reason')
            ->get();

        return array_values($notices->all());
    }

    /**
     * The owner's open notices, newest first.
     *
     * @return list<self>
     */
    public static function openNotices(): array
    {
        return array_values(self::query()->open()->newestFirst()->limit(20)->get()->all());
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function open(Builder $query): void
    {
        $query->whereNull('resolved_at');
    }

    /**
     * The driver's notices.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofDriver(Builder $query, string $driver): void
    {
        $query->where('driver', $driver);
    }

    /**
     * The notices given for the reason.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forReason(Builder $query, AccountNoticeReason $reason): void
    {
        $query->where('reason', $reason->value);
    }
}
