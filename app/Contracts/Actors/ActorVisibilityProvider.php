<?php

declare(strict_types=1);

namespace App\Contracts\Actors;

use App\Exceptions\CrossOwnerReadRefused;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * What the owner of one actor type answers for reads of owned rows: the rows its actors read by default, and whether
 * they may read across every owner. Each is a constraint on the query, never a yes or no for the caller to act on.
 */
interface ActorVisibilityProvider
{
    /**
     * Narrows a read of owned rows to what the current actor reads by default.
     *
     * @param  Builder<covariant Model>  $query
     * @param  class-string<Scope<Model>>  $ownerScope  the global scope that keeps the rows of the current owner
     */
    public function ownRead(Builder $query, string $ownerScope): void;

    /**
     * Opens the read to the rows of every owner.
     *
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
     * @param  Closure(Builder<covariant Model>): void  $ownRowsScope
     */
    public function ownRows(Builder $query, Closure $ownRowsScope): void;
}
