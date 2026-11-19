<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Actors\Contracts\ActorVisibilityProvider;
use App\Actors\Enums\ActorType;
use App\Actors\Exceptions\CrossOwnerReadRefused;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * An agent reads only its own rows: the owner scope stays, and a read across owners is refused.
 */
final readonly class AgentVisibility implements ActorVisibilityProvider
{
    /**
     * @param  Builder<covariant Model>  $query
     * @param  class-string<Scope<Model>>  $ownerScope
     */
    public function ownRead(Builder $query, string $ownerScope): void {}

    /**
     * @param  Builder<covariant Model>  $query
     * @param  class-string<Scope<Model>>  $ownerScope
     */
    public function readAcrossOwners(Builder $query, string $ownerScope): void
    {
        throw CrossOwnerReadRefused::forActor(ActorType::Agent->value);
    }

    /**
     * @param  Builder<covariant Model>  $query
     * @param  Closure(Builder<covariant Model>): void  $narrowToOwnRows
     */
    public function ownRows(Builder $query, Closure $narrowToOwnRows): void
    {
        $narrowToOwnRows($query);
    }
}
