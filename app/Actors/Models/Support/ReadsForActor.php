<?php

declare(strict_types=1);

namespace App\Actors\Models\Support;

use App\Actors\Contracts\ActorVisibility;
use App\Actors\Contracts\CurrentActor;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * The read for whoever acts in this request, for a model whose owner scope gives each actor its own rows: the
 * visibility provider of the actor's type decides which rows that is.
 */
trait ReadsForActor
{
    /**
     * The global scope that keeps the current owner's rows.
     *
     * @return class-string<\Illuminate\Database\Eloquent\Scope<\Illuminate\Database\Eloquent\Model>>
     */
    abstract protected static function ownerScope(): string;

    /**
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function forActor(Builder $query): void
    {
        Container::getInstance()->make(ActorVisibility::class)->ownRead($query, static::ownerScope());
    }

    /**
     * The read across every owner's rows, for an actor whose visibility allows it; any other actor is refused.
     *
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function acrossOwners(Builder $query): void
    {
        Container::getInstance()->make(ActorVisibility::class)->readAcrossOwners($query, static::ownerScope());
    }

    /**
     * Binds a route to a row the acting actor may read; a request with no actor fails before any row is read.
     *
     * @param  mixed  $value
     * @param  string|null  $field
     */
    public function resolveRouteBinding($value, $field = null): Model|null
    {
        Container::getInstance()->make(CurrentActor::class)->actor();

        return $this->newQuery()->forActor()->where($field ?? $this->getRouteKeyName(), $value)->first();
    }
}
