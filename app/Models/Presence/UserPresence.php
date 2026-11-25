<?php

declare(strict_types=1);

namespace App\Models\Presence;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Messages\UserPresenceConfirmed;
use App\Support\PresenceWindow;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $user_id
 * @property CarbonImmutable $last_heartbeat_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 */
#[Fillable([
    'user_id',
    'last_heartbeat_at',
])]
final class UserPresence extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'last_heartbeat_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Mutations ]----------

    /**
     * The user was seen at this beat.
     */
    public function beatAt(CarbonImmutable $time): void
    {
        $this->last_heartbeat_at = $time;
        $this->assertSaved($this->save());
        $this->raise(new UserPresenceConfirmed($this->id));
    }

    // ----------[ Queries ]----------

    /**
     * The user's one row, made at this beat on the first beat and locked; two first beats at once still leave one row.
     */
    public static function lockedFor(string $userId, CarbonImmutable $time): self
    {
        $presence = new self([
            'user_id' => $userId,
            'last_heartbeat_at' => $time,
        ]);
        $presence->setAttribute($presence->getKeyName(), $presence->newUniqueId());
        $presence->insertIfAbsent();

        return self::query()->ofUser($userId)->lockForUpdate()->sole();
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

    /**
     * The user's presence.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofUser(Builder $query, string $userId): void
    {
        $query->where('user_id', $userId);
    }

    /**
     * The rows of any of the given users.
     *
     * @param  Builder<self>  $query
     * @param  array<array-key, string>|Builder<covariant Model>|Closure  $userIds
     */
    #[Scope]
    protected function ofUsers(Builder $query, array|Builder|Closure $userIds): void
    {
        $query->whereIn('user_id', $userIds);
    }
}
