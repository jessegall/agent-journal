<?php

declare(strict_types=1);

namespace App\Models\Agents;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Enums\Agents\ActivityLevel;
use App\Enums\Agents\ActivityType;
use App\Models\Support\HasActorColumns;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $actor_type
 * @property string $actor_id
 * @property ?string $environment_id
 * @property ActivityLevel $level
 * @property ActivityType $type
 * @property string $subject
 * @property ?array $found
 * @property CarbonImmutable $occurred_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 */
#[Table('activity_entries')]
final class ActivityEntry extends Model implements ReadableModel
{
    use BoundedReads;
    use HasActorColumns;
    use HasUlids;
    use Linkable;

    /**
     * The most entries one read returns.
     */
    public const int READ_ENTRY_LIMIT = 100;

    /**
     * The most entries kept for one environment; older ones are pruned.
     */
    public const int KEPT_ENTRY_LIMIT = 2000;

    /**
     * The longest a subject may be: a command or a posted line is cut to this many characters.
     */
    public const int SUBJECT_CHARACTER_LIMIT = 200;

    /**
     * The most things found one entry keeps.
     */
    public const int FOUND_COUNT_LIMIT = 5;

    /**
     * The longest one thing found may be.
     */
    public const int FOUND_CHARACTER_LIMIT = 120;

    /**
     * @return array<string, string>
     *
     * @column found list<string>|null
     */
    protected function casts(): array
    {
        return [
            'level' => ActivityLevel::class,
            'type' => ActivityType::class,
            'found' => 'array',
            'occurred_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * What an agent just did, at its type's level, its subject and what it found cut to their limits.
     *
     * @param  list<string>  $found
     */
    public static function create(
        ActorIdentity $actor,
        ActivityType $type,
        string $subject,
        string|null $environmentId,
        array $found = [],
    ): self {
        $entry = new self();
        $entry->actor_type = $actor->type;
        $entry->actor_id = $actor->id;
        $entry->environment_id = $environmentId;
        $entry->level = $type->defaultLevel();
        $entry->type = $type;
        $entry->subject = mb_substr($subject, 0, self::SUBJECT_CHARACTER_LIMIT);

        $entry->found = $found === [] ? null : array_map(
            fn (string $each) => mb_substr($each, 0, self::FOUND_CHARACTER_LIMIT),
            array_slice($found, 0, self::FOUND_COUNT_LIMIT),
        );

        $entry->occurred_at = CarbonImmutable::now();
        $entry->save();

        return $entry;
    }

    // ----------[ Scopes ]----------

    /**
     * An environment's entries older than the entry a reader saw last, newest first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function newestBefore(Builder $query, string|null $environmentId, self|null $cursor): void
    {
        $query
            ->where('environment_id', $environmentId)
            ->when($cursor !== null, fn (Builder $older) => $older->where(fn (Builder $before) => $before
                ->where('occurred_at', '<', $cursor->occurred_at)
                ->orWhere(fn (Builder $same) => $same
                    ->where('occurred_at', $cursor->occurred_at)
                    ->where('id', '<', $cursor->id))))
            ->orderByDesc('occurred_at')
            ->orderByDesc('id');
    }

    /**
     * An environment's entries made after the one with this id, oldest first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function after(Builder $query, string|null $environmentId, string $entryId): void
    {
        $query->where('environment_id', $environmentId)->where('id', '>', $entryId)->orderBy('id');
    }

    /**
     * The rows of any of the given ids.
     *
     * @param  Builder<self>  $query
     * @param  array<array-key, string>|Builder<covariant Model>|Closure  $ids
     */
    #[Scope]
    protected function withAnyId(Builder $query, array|Builder|Closure $ids): void
    {
        $query->whereIn('id', $ids);
    }

    /**
     * The entries of each environment older than the newest ones it keeps.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function pastKeptLimit(Builder $query): void
    {
        $ranked = self::query()->selectRaw(
            'id, row_number() over (partition by environment_id order by occurred_at desc, id desc) as place',
        );

        $query->whereIn('id', fn ($pruned) => $pruned->fromSub($ranked, 'ranked')
            ->where('place', '>', self::KEPT_ENTRY_LIMIT)
            ->select('id'));
    }
}
