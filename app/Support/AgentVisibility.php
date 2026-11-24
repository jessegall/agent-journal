<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\ActorVisibilityProvider;
use App\Enums\ActorType;
use App\Exceptions\CrossOwnerReadRefused;
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
     * @param  class-string<Scope<Model>>  $scope
     */
    public function readAcrossOwners(Builder $query, string $scope): void
    {
        throw CrossOwnerReadRefused::forActor(ActorType::Agent->value);
    }

    public function canReadAcrossOwners(): bool
    {
        return false;
    }

    /**
     * @param  Builder<covariant Model>  $query
     * @param  Closure(Builder<covariant Model>): void  $ownRowsScope
     */
    public function ownRows(Builder $query, Closure $ownRowsScope): void
    {
        $ownRowsScope($query);
    }
}
