<?php

declare(strict_types=1);

namespace App\Models\Records;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Links\LinkRemoved;
use App\Exceptions\CrossProjectEdge;
use App\Models\Support\BelongsToProjectOrGlobal;
use App\Models\Support\HasUlidKey;
use App\Projects\Contracts\ProjectOwned;
use App\Records\Concerns\CountsPivotLoads;
use App\Records\Contracts\ReadableModel;
use App\Values\ProjectOwner;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphPivot;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * @property string $id
 * @property string $source_type
 * @property string $source_id
 * @property string $target_type
 * @property string $target_id
 * @property string|null $project_id
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Model $source
 * @property-read Model $target
 *
 * @mixin \Eloquent
 */
#[Table('links')]
final class Link extends MorphPivot implements EventSource, ProjectOwned, ReadableModel
{
    use BelongsToProjectOrGlobal;
    use BoundedReads;
    use CountsPivotLoads;
    use HasUlidKey;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

    /**
     * A pivot opens every attribute by default; this one stays closed, as every model writes its columns as properties.
     *
     * @var list<string>
     */
    protected $guarded = ['*'];

    // ----------[ Constructors ]----------

    /**
     * The link between the two models, made now when there is none yet in either direction, of the project of the
     * end that has one; two ends of different projects are never linked.
     *
     * @throws CrossProjectEdge
     */
    public static function createForModels(Model $source, Model $target): self
    {
        $owner = self::ownerOfEnds($source, $target);
        $existing = self::findBetween($source, $target);

        if ($existing !== null) {
            return $existing;
        }

        $link = new self();
        $link->source_type = $source->getMorphClass();
        $link->source_id = $source->getKey();
        $link->target_type = $target->getMorphClass();
        $link->target_id = $target->getKey();
        $link->assignOwner($owner);
        $link->save();

        return $link;
    }

    /**
     * A link stored as given, between two records named by their link type and id, of the owner given.
     */
    public static function create(
        string $sourceType,
        string $sourceId,
        string $targetType,
        string $targetId,
        ProjectOwner $owner,
    ): self {
        $link = new self();
        $link->source_type = $sourceType;
        $link->source_id = $sourceId;
        $link->target_type = $targetType;
        $link->target_id = $targetId;
        $link->assignOwner($owner);
        $link->save();

        return $link;
    }

    /**
     * The link between a model and a record named only by its link alias and id, made now when there is none yet, of
     * the model's project; the named record is never loaded.
     */
    public static function createForKey(Model $source, string $targetType, string $targetId): self
    {
        $existing = self::findTouchingKey($source, $targetType, $targetId);

        if ($existing !== null) {
            return $existing;
        }

        return self::create(
            $source->getMorphClass(),
            (string) $source->getKey(),
            $targetType,
            $targetId,
            self::ownerOf($source),
        );
    }

    // ----------[ Mutations ]----------

    /**
     * Deletes this link; what rested on it is told by whoever removed it.
     */
    public function remove(): void
    {
        $this->delete();
        $this->raise(new LinkRemoved($this->id));
    }

    // ----------[ Transformers ]----------

    /**
     * The record on the other side of this link from the one given, by its link alias and id.
     *
     * @return array{string, string}
     */
    public function otherSideFrom(Model $record): array
    {
        return $this->otherSideFromKey($record->getMorphClass(), (string) $record->getKey());
    }

    /**
     * The record on the other side of this link from the record of this link alias and id.
     *
     * @return array{string, string}
     */
    public function otherSideFromKey(string $type, string $id): array
    {
        $isSource = $this->source_type === $type && $this->source_id === $id;

        if ($isSource) {
            return [
                $this->target_type,
                $this->target_id,
            ];
        }

        return [
            $this->source_type,
            $this->source_id,
        ];
    }

    // ----------[ Relations ]----------

    /**
     * @return MorphTo<Model, $this>
     */
    public function source(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * @return MorphTo<Model, $this>
     */
    public function target(): MorphTo
    {
        return $this->morphTo();
    }

    // ----------[ Internals ]----------

    /**
     * The owner a link between the two ends takes: the project of the end that has one, Global when neither has.
     *
     * @throws CrossProjectEdge when the ends are of two projects
     */
    private static function ownerOfEnds(Model $source, Model $target): ProjectOwner
    {
        $bothOwned = $source instanceof ProjectOwned && $target instanceof ProjectOwned;

        if ($bothOwned && ! $target->projectOwner()->isGlobal()) {
            $target->assertSameProjectAs($source);
        }

        if (self::ownerOf($source)->isGlobal()) {
            return self::ownerOf($target);
        }

        return self::ownerOf($source);
    }

    /**
     * The project of a record; a record no project owns counts as Global.
     */
    private static function ownerOf(Model $record): ProjectOwner
    {
        if ($record instanceof ProjectOwned) {
            return $record->projectOwner();
        }

        return ProjectOwner::global();
    }

    // ----------[ Queries ]----------

    /**
     * The link between the two models; none before the first.
     */
    public static function findBetween(Model $source, Model $target): self|null
    {
        return self::query()->between($source, $target)->first();
    }

    /**
     * The link from the model to this keyed record; none before the first.
     */
    public static function findTouchingKey(Model $source, string $targetType, string $targetId): self|null
    {
        return self::query()->touching($source)->touchingKey($targetType, $targetId)->first();
    }

    // ----------[ Scopes ]----------

    /**
     * Every link with this record on either side.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function touching(Builder $query, Model $record): void
    {
        $query->touchingKey($record->getMorphClass(), (string) $record->getKey());
    }

    /**
     * Every link with the record of this link alias and id on either side.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function touchingKey(Builder $query, string $type, string $id): void
    {
        $query->where(fn (Builder $either) => $either
            ->where(fn (Builder $source) => $source->where('source_type', $type)->where('source_id', $id))
            ->orWhere(fn (Builder $target) => $target->where('target_type', $type)->where('target_id', $id)));
    }

    /**
     * Every link between this record and a record of the given link alias, in either direction.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function fromRecordToType(Builder $query, Model $record, string $type): void
    {
        $query->where(fn (Builder $either) => $either
            ->where(fn (Builder $forward) => $forward->withSource($record)->where('target_type', $type))
            ->orWhere(fn (Builder $backward) => $backward->withTarget($record)->where('source_type', $type)));
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function between(Builder $query, Model $first, Model $second): void
    {
        $query->where(fn (Builder $either) => $either
            ->where(fn (Builder $forward) => $forward->withSource($first)->withTarget($second))
            ->orWhere(fn (Builder $backward) => $backward->withSource($second)->withTarget($first)));
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withSource(Builder $query, Model $source): void
    {
        $query->withSourceKey($source->getMorphClass(), (string) $source->getKey());
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withTarget(Builder $query, Model $target): void
    {
        $query->withTargetKey($target->getMorphClass(), (string) $target->getKey());
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withSourceKey(Builder $query, string $type, string $id): void
    {
        $query->where('source_type', $type)->where('source_id', $id);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withTargetKey(Builder $query, string $type, string $id): void
    {
        $query->where('target_type', $type)->where('target_id', $id);
    }

    /**
     * The links whose target is of the type.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function toTargetType(Builder $query, string $type): void
    {
        $query->where('target_type', $type);
    }

    /**
     * The links whose source is of the type.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function fromSourceType(Builder $query, string $type): void
    {
        $query->where('source_type', $type);
    }

    /**
     * Only the target of each row, as a subquery.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function targetIds(Builder $query): void
    {
        $query->select('target_id');
    }

    /**
     * Only the source of each row, as a subquery.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function sourceIds(Builder $query): void
    {
        $query->select('source_id');
    }
}
