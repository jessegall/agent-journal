<?php

declare(strict_types=1);

namespace Domain\Documents\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Actors\Actor;
use App\Contracts\Records\ReadableModel;
use App\Enums\ActorType;
use App\Models\Support\Accessor;
use Carbon\CarbonImmutable;
use Domain\Documents\Data\SettlementCard;
use Domain\Documents\Exceptions\RecordImmutable;
use Domain\Documents\Support\RecordViews;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $parent_type
 * @property string $parent_id
 * @property ActorType $actor_type
 * @property string $actor_id
 * @property string $reason
 * @property ?int $revision_number
 * @property CarbonImmutable $settled_at
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property mixed $card attribute
 */
#[Fillable([
    'parent_type',
    'parent_id',
    'actor_type',
    'actor_id',
    'reason',
    'revision_number',
    'settled_at',
])]
final class RecordSettlement extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    protected function casts(): array
    {
        return [
            'actor_type' => ActorType::class,
            'revision_number' => 'integer',
            'settled_at' => 'immutable_datetime',
        ];
    }

    protected static function booted(): void
    {
        self::updating(fn (self $settlement) => $settlement->assertUnedited());
    }

    // ----------[ Constructors ]----------

    public static function create(
        string $parentType,
        string $parentId,
        Actor $actor,
        string $reason,
        int|null $revisionNumber,
    ): self {
        return self::query()->create([
            'parent_type' => $parentType,
            'parent_id' => $parentId,
            'actor_type' => $actor->actorType(),
            'actor_id' => $actor->actorId(),
            'reason' => $reason,
            'revision_number' => $revisionNumber,
            'settled_at' => CarbonImmutable::now(),
        ]);
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<SettlementCard, never>
     */
    protected function card(): Attribute
    {
        return Accessor::get(fn () => RecordViews::settlementCard($this));
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses every edit: a settlement stays as it was written.
     *
     * @throws RecordImmutable
     */
    private function assertUnedited(): never
    {
        throw RecordImmutable::for('settlement');
    }

    // ----------[ Scopes ]----------

    /**
     * The settlements of one record, newest first.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function onRecord(Builder $query, string $type, string $id): void
    {
        $query->where('parent_type', $type)->where('parent_id', $id)->orderByDesc('settled_at')->orderByDesc('id');
    }
}
