<?php

declare(strict_types=1);

namespace App\Profiles\Models;

use App\Contracts\EventSource;
use App\Contracts\Support\RaisesEvents;
use App\Links\Support\Linkable;
use App\Profiles\Enums\AccountNoticeReason;
use App\Profiles\Events\AccountNoticeRecorded;
use App\Profiles\Events\AccountNoticeResolved;
use App\Profiles\Models\Support\AccountOwnerScope;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * Something the owner should look at on a program's accounts, kept even when no account or session exists: the
 * program, the safe reason and how often it happened, until the owner dismisses it or a later success resolves it.
 *
 * @property string $id
 * @property string $program
 * @property AccountNoticeReason $reason
 * @property int $times
 * @property CarbonImmutable|null $resolved_at
 * @property Carbon $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['program', 'reason'])]
final class AccountNotice extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    // ----------[ Constructors ]----------

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

    /**
     * A new open notice of the program and reason, counted once.
     */
    public static function create(string $program, AccountNoticeReason $reason): self
    {
        $notice = new self(['program' => $program, 'reason' => $reason->value]);
        $notice->assertSaved($notice->save());
        $notice->raise(new AccountNoticeRecorded($notice->program, $notice->id));

        return $notice;
    }

    // ----------[ Queries ]----------

    /**
     * The program's open notice of the reason, locked, if one is open.
     */
    public static function lockedOpenFor(string $program, AccountNoticeReason $reason): self|null
    {
        return self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->open()
            ->where('program', $program)
            ->where('reason', $reason->value)
            ->lockForUpdate()
            ->first();
    }

    /**
     * The program's open notices, locked in the order of their ids.
     *
     * @return list<self>
     */
    public static function lockedOpenOf(string $program): array
    {
        $notices = self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->open()
            ->where('program', $program)
            ->orderBy('id')
            ->lockForUpdate()
            ->readAll('a program keeps one open notice per reason')
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
        return array_values(self::query()->open()->latest()->limit(20)->get()->all());
    }

    // ----------[ Mutations ]----------

    /**
     * Counts the notice once more: it happened again while it was open.
     */
    public function countAgain(): void
    {
        $this->times++;
        $this->assertSaved($this->save());
        $this->raise(new AccountNoticeRecorded($this->program, $this->id));
    }

    /**
     * Closes the notice: the owner dismissed it, or the program's accounts work again.
     */
    public function resolveAt(CarbonImmutable $now): void
    {
        $this->resolved_at = $now;
        $this->assertSaved($this->save());
        $this->raise(new AccountNoticeResolved($this->program, $this->id));
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
}
