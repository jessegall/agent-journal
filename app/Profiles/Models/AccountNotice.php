<?php

declare(strict_types=1);

namespace App\Profiles\Models;

use App\Links\Support\Linkable;
use App\Profiles\Enums\AccountNoticeReason;
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
final class AccountNotice extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

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
     * Records that it happened: an open notice of the same program and reason counts once more instead of repeating.
     */
    public static function raise(string $program, AccountNoticeReason $reason): self
    {
        $open = self::query()
            ->withoutGlobalScope(AccountOwnerScope::class)
            ->open()
            ->where('program', $program)
            ->where('reason', $reason->value)
            ->lockForUpdate()
            ->first();

        if ($open !== null) {
            $open->times++;
            $open->save();

            return $open;
        }

        $notice = new self(['program' => $program, 'reason' => $reason->value]);
        $notice->save();

        return $notice;
    }

    // ----------[ Queries ]----------

    /**
     * Resolves the program's open notices once its accounts work again.
     */
    public static function resolveFor(string $program, CarbonImmutable $now): void
    {
        self::query()->withoutGlobalScope(
            AccountOwnerScope::class,
        )->open()->where('program', $program)->update(['resolved_at' => $now]);
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

    public function dismiss(CarbonImmutable $now): void
    {
        $this->resolved_at = $now;
        $this->save();
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
