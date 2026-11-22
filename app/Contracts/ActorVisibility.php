<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Exceptions\CrossOwnerReadRefused;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * The reads of owned rows for whoever acts in this request, through the visibility provider of the actor's type.
 */
interface ActorVisibility
{
    /**
     * @param  Builder<covariant Model>  $query
     * @param  class-string<Scope<Model>>  $ownerScope
     */
    public function ownRead(Builder $query, string $ownerScope): void;

    /**
     * @param  Builder<covariant Model>  $query
     * @param  class-string<Scope<Model>>  $ownerScope
     *
     * @throws CrossOwnerReadRefused
     */
    public function readAcrossOwners(Builder $query, string $ownerScope): void;

    /**
     * Narrows a read of ordinary content to the acting actor's own rows, by the narrowing the caller gives; an actor
     * that sees no ordinary content gets none.
     *
     * @param  Builder<covariant Model>  $query
     * @param  Closure(Builder<covariant Model>): void  $narrowToOwnRows
     */
    public function ownRows(Builder $query, Closure $narrowToOwnRows): void;
}
