<?php

declare(strict_types=1);

namespace App\Actors\Models;

use App\Actors\Support\PresenceWindow;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

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
    use Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'last_heartbeat_at' => 'immutable_datetime',
        ];
    }

    /**
     * Writes the user's one row with this beat, creating it on the first beat; two beats at once still leave one row.
     */
    public static function recordFor(string $userId, CarbonImmutable $time): void
    {
        self::query()->upsert(
            [['id' => (string) Str::ulid(), 'user_id' => $userId, 'last_heartbeat_at' => $time]],
            ['user_id'],
            ['last_heartbeat_at'],
        );
    }

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
