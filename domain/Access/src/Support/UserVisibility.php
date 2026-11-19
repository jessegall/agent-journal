<?php

declare(strict_types=1);

namespace Domain\Access\Support;

use App\Actors\Contracts\ActorVisibilityProvider;
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
     * @param  class-string<Scope<Model>>  $ownerScope
     */
    public function readAcrossOwners(Builder $query, string $ownerScope): void
    {
        $query->withoutGlobalScope($ownerScope);
    }
}
