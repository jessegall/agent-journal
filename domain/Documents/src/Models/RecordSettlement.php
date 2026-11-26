<?php

declare(strict_types=1);

namespace Domain\Documents\Models;

use App\Actors\Contracts\Actor;
use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Models\Support\Accessor;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use Carbon\CarbonImmutable;
use Domain\Documents\Data\SettlementCard;
use Domain\Documents\Exceptions\RecordImmutable;
use Domain\Documents\Support\RecordViews;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;

/**
 * @property string $id
 * @property string $parent_type
 * @property string $parent_id
 * @property string $actor_type
 * @property string $actor_id
 * @property string $reason
 * @property int|null $revision_number
 * @property CarbonImmutable $settled_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read mixed $card
 *
 * @mixin \Eloquent
 */
final class RecordSettlement extends JournalModel implements ReadableModel
{
    use BoundedReads;
    use Linkable;

    protected function casts(): array
    {
        return [
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
        $recordSettlement = new self();
        $recordSettlement->parent_type = $parentType;
        $recordSettlement->parent_id = $parentId;
        $recordSettlement->actor_type = $actor->actorType();
        $recordSettlement->actor_id = $actor->actorId();
        $recordSettlement->reason = $reason;
        $recordSettlement->revision_number = $revisionNumber;
        $recordSettlement->settled_at = CarbonImmutable::now();
        $recordSettlement->save();

        return $recordSettlement;
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
