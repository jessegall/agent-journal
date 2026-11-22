<?php

declare(strict_types=1);

namespace App\Models\Support;

use App\Contracts\CurrentActor;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * Limits a model to the rows of the current request's actor. It asks for the actor on every query, so a worker that
 * serves many requests never keeps an earlier request's actor.
 *
 * @implements Scope<Model>
 */
final readonly class ActorScope implements Scope
{
    /**
     * @param  Closure(): CurrentActor  $actors
     */
    public function __construct(private Closure $actors) {}

    /**
     * @param  Builder<covariant Model>  $builder
     */
    public function apply(Builder $builder, Model $model): void
    {
        $actor = ($this->actors)()->actor();

        $builder->where(
            $model->qualifyColumn('actor_type'),
            $actor->actorType()->value,
        )->where($model->qualifyColumn('actor_id'), $actor->actorId());
    }
}
