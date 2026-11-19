<?php

declare(strict_types=1);

namespace App\Actors\Models\Support;

use App\Actors\Contracts\ActorVisibility;
use App\Actors\Contracts\CurrentActor;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * Limits a query to the acting actor's own rows as its type's visibility says: an actor that sees every row, such as
 * the owner, reads them all.
 *
 * @implements Scope<Model>
 */
final readonly class VisibleActorScope implements Scope
{
    /**
     * @param  Closure(): ActorVisibility  $visibility
     * @param  Closure(): CurrentActor  $actors
     */
    public function __construct(private Closure $visibility, private Closure $actors) {}

    /**
     * @param  Builder<covariant Model>  $builder
     */
    public function apply(Builder $builder, Model $model): void
    {
        ($this->visibility)()->ownRows($builder, function (Builder $query) use ($model): void {
            $actor = ($this->actors)()->actor();
            $query->where($model->qualifyColumn('actor_type'), $actor->actorType()->value)
                ->where($model->qualifyColumn('actor_id'), $actor->actorId());
        });
    }
}
