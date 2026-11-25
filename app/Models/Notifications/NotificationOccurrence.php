<?php

declare(strict_types=1);

namespace App\Models\Notifications;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Data\Notifications\NotificationTarget;
use App\Enums\Notifications\NotificationSourceType;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $occurrence_key
 * @property NotificationSourceType $source_type
 * @property string $target_key
 * @property string $target_id
 * @property CarbonImmutable|null $created_at
 *
 * @mixin \Eloquent
 */
#[Table('notification_occurrences')]
final class NotificationOccurrence extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use InsertsAbsentRows;
    use Linkable;

    public const ?string UPDATED_AT = null;

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'source_type' => NotificationSourceType::class,
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The occurrence of this key, inserted unless the key is already taken; isNew() tells a replay apart.
     */
    public static function create(string $key, NotificationSourceType $source, NotificationTarget $target): self
    {
        $occurrence = new self();
        $occurrence->occurrence_key = $key;
        $occurrence->source_type = $source;
        $occurrence->target_key = $target->key;
        $occurrence->target_id = $target->id;

        $occurrence->id = $occurrence->newUniqueId();
        $occurrence->insertIfAbsent();

        return $occurrence;
    }

    // ----------[ Predicates ]----------

    /**
     * Whether this call inserted the occurrence, rather than meeting one of the same key.
     */
    public function isNew(): bool
    {
        return $this->wasRecentlyCreated;
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function keyed(Builder $query, string $key): void
    {
        $query->where('occurrence_key', $key);
    }

    /**
     * Occurrences of one target type whose target id the query lists.
     *
     * @param  Builder<self>  $query
     * @param  Builder<*>  $ids
     */
    #[Scope]
    protected function targeting(Builder $query, string $key, Builder $ids): void
    {
        $query->where('target_key', $key)->whereIn('target_id', $ids);
    }

    /**
     * The occurrences about the target.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function aboutTarget(Builder $query, string $targetKey, string $targetId): void
    {
        $query->where('target_key', $targetKey)->where('target_id', $targetId);
    }
}
