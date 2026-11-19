<?php

declare(strict_types=1);

namespace App\Links\Models;

use App\Links\Events\LinksRemoved;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Reads\Support\CountsPivotLoads;
use App\Reads\Support\ReadBuilder;
use Illuminate\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphPivot;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Carbon;

/**
 * One link between two models of any type. A link has no direction for lookups: A to B is the same link as B to A.
 *
 * @property string $id
 * @property string $source_type
 * @property string $source_id
 * @property string $target_type
 * @property string $target_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Table('links')]
#[Fillable(['source_type', 'source_id', 'target_type', 'target_id'])]
final class Link extends MorphPivot implements ReadableModel
{
    use BoundedReads, CountsPivotLoads;
    use HasUlids, Linkable;

    /**
     * A pivot opens every attribute by default; this one takes only its Fillable list.
     *
     * @var list<string>
     */
    protected $guarded = ['*'];

    /**
     * The link between the two models, made now when there is none yet in either direction.
     */
    public static function connect(Model $source, Model $target): self
    {
        return self::query()->between($source, $target)->first() ?? self::query()->create([
            'source_type' => $source->getMorphClass(),
            'source_id' => $source->getKey(),
            'target_type' => $target->getMorphClass(),
            'target_id' => $target->getKey(),
        ]);
    }

    /**
     * The link between a model and a record named only by its link alias and id, made now when there is none yet;
     * the named record is never loaded.
     */
    public static function connectKey(Model $source, string $targetType, string $targetId): self
    {
        return self::query()->touching($source)->touchingKey($targetType, $targetId)->first()
            ?? self::recorded($source->getMorphClass(), (string) $source->getKey(), $targetType, $targetId);
    }

    /**
     * Narrows a query of records the caller may read to those linked, in either direction, to the record of this
     * link alias and id.
     *
     * @template TModel of Model
     *
     * @param  Builder<TModel>  $records
     * @return Builder<TModel>
     */
    public static function narrowToLinked(Builder $records, string $type, string $id): Builder
    {
        $other = $records->getModel();
        $key = $other->getQualifiedKeyName();
        $otherType = $other->getMorphClass();
        $asTargets = self::query()->withSourceKey($type, $id)->where('target_type', $otherType)->select('target_id');
        $asSources = self::query()->withTargetKey($type, $id)->where('source_type', $otherType)->select('source_id');

        return $records->where(fn (Builder $linked) => $linked->whereIn($key, $asTargets)->orWhereIn($key, $asSources));
    }

    /**
     * A link stored as given, between two records named by their link type and id.
     */
    public static function recorded(string $sourceType, string $sourceId, string $targetType, string $targetId): self
    {
        $link = new self();
        $link->source_type = $sourceType;
        $link->source_id = $sourceId;
        $link->target_type = $targetType;
        $link->target_id = $targetId;
        $link->save();

        return $link;
    }

    /**
     * Removes every link to or from the given models, which are about to be deleted.
     *
     * @param  list<Model>  $models
     */
    public static function forgetModels(array $models): void
    {
        $removed = [];

        foreach ($models as $model) {
            array_push($removed, ...self::removeAll(self::query()->touching($model)));
        }

        self::announceRemoved($removed);
    }

    /**
     * Removes the link between the two models, in either direction, and announces it.
     */
    public static function removeBetween(Model $first, Model $second): void
    {
        self::announceRemoved(self::removeAll(self::query()->between($first, $second)));
    }

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

        return $isSource ? [$this->target_type, $this->target_id] : [$this->source_type, $this->source_id];
    }

    /**
     * Deletes the links of the query and returns their ids.
     *
     * @param  ReadBuilder<self>  $query
     * @return list<string>
     */
    private static function removeAll(ReadBuilder $query): array
    {
        $removed = $query->readAll('every removed link is announced by id')->pluck('id');
        $ids = array_values(array_map(strval(...), $removed->all()));
        self::query()->whereKey($ids)->delete();

        return $ids;
    }

    /**
     * Raises LinksRemoved inside the running transaction, so what rested on the links ends with them.
     *
     * @param  list<string>  $ids
     */
    private static function announceRemoved(array $ids): void
    {
        if ($ids !== []) {
            Container::getInstance()->make(Dispatcher::class)->dispatch(new LinksRemoved($ids));
        }
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
}
