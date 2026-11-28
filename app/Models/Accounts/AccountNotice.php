<?php

declare(strict_types=1);

namespace App\Models\Accounts;

use App\Accounts\Enums\AccountNoticeReason;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Accounts\AccountNoticeRecorded;
use App\Events\Accounts\AccountNoticeResolved;
use App\Models\Support\AccountOwnerScope;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property string $id
 * @property string $driver
 * @property AccountNoticeReason $reason
 * @property int $times
 * @property CarbonImmutable|null $resolved_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class AccountNotice extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
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
        $notice = new self();
        $notice->driver = $driver;
        $notice->reason = $reason;
        $notice->saveAndAssert();
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
        $this->saveAndAssert();
        $this->raise(new AccountNoticeRecorded($this->driver, $this->id));
    }

    /**
     * Closes the notice: the owner dismissed it, or the driver's accounts work again.
     */
    public function resolveAt(CarbonImmutable $now): void
    {
        $this->resolved_at = $now;
        $this->saveAndAssert();
        $this->raise(new AccountNoticeResolved($this->driver, $this->id));
    }

    // ----------[ Queries ]----------

    /**
     * The driver's open notice of the reason, locked, if one is open.
     */
    public static function findLockedOpenFor(string $driver, AccountNoticeReason $reason): self|null
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
    public static function findLockedOpenOf(string $driver): array
    {
        $notices = self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->open()
            ->ofDriver($driver)
            ->oldestFirst()
            ->lockForUpdate()
            ->get();

        return array_values($notices->all());
    }

    /**
     * The owner's open notices, newest first.
     *
     * @return list<self>
     */
    public static function findOpenNotices(): array
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
