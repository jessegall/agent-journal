<?php

declare(strict_types=1);

namespace App\Links\Models;

use App\Links\Support\Linkable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Carbon;

/**
 * One link between two models of any type. A link has no direction for lookups: A to B is the same link as B to A.
 *
 * @property int $id
 * @property string $source_type
 * @property int $source_id
 * @property string $target_type
 * @property int $target_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['source_type', 'source_id', 'target_type', 'target_id'])]
final class Link extends Model
{
    use Linkable;

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
     * Removes every link to or from the given models, which are about to be deleted.
     *
     * @param  list<Model>  $models
     */
    public static function forgetModels(array $models): void
    {
        foreach ($models as $model) {
            self::query()->where(fn (Builder $either) => $either->withSource($model)->orWhere(fn (Builder $target) => $target->withTarget($model)))->delete();
        }
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
        $query->where('source_type', $source->getMorphClass())->where('source_id', $source->getKey());
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withTarget(Builder $query, Model $target): void
    {
        $query->where('target_type', $target->getMorphClass())->where('target_id', $target->getKey());
    }
}
