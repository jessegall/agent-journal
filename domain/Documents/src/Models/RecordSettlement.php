<?php

declare(strict_types=1);

namespace Domain\Documents\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Actor;
use App\Contracts\ReadableModel;
use App\Enums\ActorType;
use Carbon\CarbonImmutable;
use Domain\Documents\Data\SettlementCard;
use Domain\Documents\Exceptions\RecordImmutable;
use Domain\Documents\Support\RecordViews;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * A record settled as needing no more attention: who did it, why, and the revision it was at. Written once; a later
 * changed revision makes the document active again and leaves this row in its history.
 *
 * @property string $id
 * @property ActorType $actor_type
 * @property string $actor_id
 * @property string $reason
 * @property int|null $revision_number
 * @property CarbonImmutable $settled_at
 */
#[Fillable(['parent_type', 'parent_id', 'actor_type', 'actor_id', 'reason', 'revision_number', 'settled_at'])]
final class RecordSettlement extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const string LINK_TYPE = 'documents.settlement';

    // ----------[ Constructors ]----------

    protected function casts(): array
    {
        return [
            'actor_type' => ActorType::class,
            'revision_number' => 'integer',
            'settled_at' => 'immutable_datetime',
        ];
    }

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

    protected static function booted(): void
    {
        self::updating(function (self $settlement): void {
            throw RecordImmutable::for('settlement');
        });
    }

    // ----------[ Answers ]----------

    public function card(): SettlementCard
    {
        return RecordViews::settlementCard($this);
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
