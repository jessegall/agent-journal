<?php

declare(strict_types=1);

namespace App\Models\Support;

use App\Contracts\Actors\CurrentActor;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * Limits process starts to the acting agent's own; anyone else reads none except through the named supervisor and
 * account-use reads. It asks for the actor on every query, so a worker that serves many requests never keeps an
 * earlier request's actor.
 *
 * @implements Scope<Model>
 */
final readonly class ProcessStartScope implements Scope
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
        $actors = ($this->actors)();

        if (! $actors->hasActor()) {
            $builder->whereKey([]);

            return;
        }

        $builder->where($model->qualifyColumn('agent_id'), $actors->actor()->actorId());
    }
}
