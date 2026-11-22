<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\ActorVisibilityProvider;
use App\Exceptions\CrossOwnerReadRefused;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * The journal itself, as the system or the engine, sees no ordinary content: an owned read keeps its owner scope, a
 * content read finds nothing, and a read across owners is refused.
 */
final readonly class JournalVisibility implements ActorVisibilityProvider
{
    /**
     * @param  Builder<covariant Model>  $query
     * @param  class-string<Scope<Model>>  $ownerScope
     */
    public function ownRead(Builder $query, string $ownerScope): void {}

    /**
     * @param  Builder<covariant Model>  $query
     * @param  class-string<Scope<Model>>  $scope
     */
    public function readAcrossOwners(Builder $query, string $scope): void
    {
        throw CrossOwnerReadRefused::forActor('journal');
    }

    /**
     * @param  Builder<covariant Model>  $query
     * @param  Closure(Builder<covariant Model>): void  $narrowToOwnRows
     */
    public function ownRows(Builder $query, Closure $narrowToOwnRows): void
    {
        $query->whereKey([]);
    }
}
