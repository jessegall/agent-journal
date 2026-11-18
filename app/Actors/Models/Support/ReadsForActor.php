<?php

declare(strict_types=1);

namespace App\Actors\Models\Support;

use App\Actors\Contracts\CurrentActor;
use Illuminate\Container\Container;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * The read for whoever acts in this request, for a model whose owner scope gives each actor its own rows: a user reads
 * through the model's visibleToUser scope, anyone else keeps the owner scope.
 */
trait ReadsForActor
{
    /**
     * @param  Builder<static>  $query
     */
    #[Scope]
    protected function forActor(Builder $query): void
    {
        $actors = Container::getInstance()->make(CurrentActor::class);

        if ($actors->isSignedIn() && $actors->actor()->isUser()) {
            $query->visibleToUser();
        }
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
