<?php

declare(strict_types=1);

namespace App\Models\Presence;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Messages\UserPresenceConfirmed;
use App\Models\Support\JournalModel;
use App\Support\PresenceWindow;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $user_id
 * @property CarbonImmutable $last_heartbeat_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class UserPresence extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
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

    // ----------[ Constructors ]----------

    /**
     * The user's one row, made at this beat on the first beat and locked; two first beats at once still leave one row.
     */
    public static function create(string $userId, CarbonImmutable $time): self
    {
        $presence = new self();
        $presence->user_id = $userId;
        $presence->last_heartbeat_at = $time;
        $presence->setAttribute($presence->getKeyName(), $presence->newUniqueId());
        $presence->insertIfAbsent();

        return self::findLockedOfUser($userId);
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
     * The user's presence, locked until the transaction ends.
     */
    public static function findLockedOfUser(string $userId): self
    {
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
     * @param  array<array-key, string>|Builder<covariant Model>|Closure  $ids
     */
    #[Scope]
    protected function ofUsers(Builder $query, array|Builder|Closure $ids): void
    {
        $query->whereIn('user_id', $ids);
    }
}
