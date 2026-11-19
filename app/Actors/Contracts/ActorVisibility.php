<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use App\Actors\Exceptions\CrossOwnerReadRefused;
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
}
