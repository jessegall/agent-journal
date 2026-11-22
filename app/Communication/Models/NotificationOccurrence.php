<?php

declare(strict_types=1);

namespace App\Communication\Models;

use App\Communication\Data\NotificationTarget;
use App\Communication\Enums\NotificationSourceType;
use App\Contracts\Support\InsertsAbsentRows;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * One committed business event that notifies its recipients, once per occurrence key: what it came from and the
 * work it opens. Each recipient holds its own receipt of it.
 *
 * @property string $id
 * @property string $occurrence_key
 * @property NotificationSourceType $source_type
 * @property string $target_key
 * @property string $target_id
 * @property CarbonImmutable|null $created_at
 */
#[Table('notification_occurrences')]
#[Fillable(['occurrence_key', 'source_type', 'target_key', 'target_id'])]
final class NotificationOccurrence extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use InsertsAbsentRows;
    use Linkable;

    public const ?string UPDATED_AT = null;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'source_type' => NotificationSourceType::class,
            'created_at' => 'immutable_datetime',
        ];
    }

    /**
     * The occurrence of this key, inserted unless the key is already taken; isNew() tells a replay apart.
     */
    public static function create(string $key, NotificationSourceType $source, NotificationTarget $target): self
    {
        $occurrence = new self([
            'occurrence_key' => $key,
            'source_type' => $source,
            'target_key' => $target->key,
            'target_id' => $target->id,
        ]);

        $occurrence->id = $occurrence->newUniqueId();
        $occurrence->insertIfAbsent();

        return $occurrence;
    }

    // ----------[ Answers ]----------

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
}
