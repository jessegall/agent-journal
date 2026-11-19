<?php

declare(strict_types=1);

namespace App\Assignments\Models\Support;

use App\Actors\Contracts\ActorVisibility;
use App\Actors\Contracts\CurrentActor;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * Limits assignments to requests where a user or an agent signed in: each of them sees every assignment, as every
 * one sees every task and plan, while a request with nobody acting, or with the system acting, sees none. It asks for
 * the actor on every query, so
 * a worker that serves many requests never keeps an earlier request's actor.
 *
 * @implements Scope<Model>
 */
final readonly class SignedInScope implements Scope
{
    /**
     * @param  Closure(): CurrentActor  $actors
     * @param  Closure(): ActorVisibility  $visibility
     */
    public function __construct(private Closure $actors, private Closure $visibility) {}

    /**
     * @param  Builder<covariant Model>  $builder
     */
    public function apply(Builder $builder, Model $model): void
    {
        if (! ($this->actors)()->hasActor()) {
            $builder->whereKey([]);

            return;
        }

        ($this->visibility)()->ownRows($builder, function (): void {});
    }
}
