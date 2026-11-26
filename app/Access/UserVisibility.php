<?php

declare(strict_types=1);

namespace App\Access;

use App\Actors\Contracts\ActorVisibilityProvider;
use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

/**
 * A user the access policy let in may inspect every owner's rows, and reads them by default.
 */
final readonly class UserVisibility implements ActorVisibilityProvider
{
    /**
     * @param  Builder<covariant Model>  $query
     * @param  class-string<Scope<Model>>  $ownerScope
     */
    public function ownRead(Builder $query, string $ownerScope): void
    {
        $this->readAcrossOwners($query, $ownerScope);
    }

    /**
     * @param  Builder<covariant Model>  $query
     * @param  class-string<Scope<Model>>  $scope
     */
    public function readAcrossOwners(Builder $query, string $scope): void
    {
        $query->withoutGlobalScope($scope);
    }

    public function canReadAcrossOwners(): bool
    {
        return true;
    }

    /**
     * @param  Builder<covariant Model>  $query
     * @param  Closure(Builder<covariant Model>): void  $scope
     */
    public function ownRows(Builder $query, Closure $scope): void
    {
        $scope($query);
    }
}
