<?php

declare(strict_types=1);

namespace App\Models;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Contracts\ReadableModel;
use App\Support\PresenceWindow;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One row per user with the user's last heartbeat; every tab and device of the user refreshes the same row.
 *
 * @property string $id
 * @property string $user_id
 * @property CarbonImmutable $last_heartbeat_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['user_id', 'last_heartbeat_at'])]
final class UserPresence extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use InsertsAbsentRows;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'last_heartbeat_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Queries ]----------

    /**
     * The user's one row, made at this beat on the first beat and locked; two first beats at once still leave one row.
     */
    public static function lockedFor(string $userId, CarbonImmutable $time): self
    {
        $presence = new self(['user_id' => $userId, 'last_heartbeat_at' => $time]);
        $presence->setAttribute($presence->getKeyName(), $presence->newUniqueId());
        $presence->insertIfAbsent();

        return self::query()->where('user_id', $userId)->lockForUpdate()->sole();
    }

    // ----------[ Mutations ]----------

    /**
     * The user was seen at this beat.
     */
    public function beatAt(CarbonImmutable $time): void
    {
        $this->last_heartbeat_at = $time;
        $this->save();
    }

    // ----------[ Scopes ]----------

    /**
     * The rows whose beat still counts at the observation time: the beat plus the window is strictly later.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function freshAt(Builder $query, CarbonImmutable $observedAt, PresenceWindow $window): void
    {
        $query->where('last_heartbeat_at', '>', $observedAt->subSeconds($window->presenceSeconds));
    }
}
