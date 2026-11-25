<?php

declare(strict_types=1);

namespace Tests\Fixtures\ScopeIndexes;

use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * A model whose scopes match a carrier, an owner and parcels not yet delivered, and order the newest first.
 */
#[Table('parcels')]
final class Parcel extends Model
{
    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofCarrier(Builder $query, string $carrierId): void
    {
        $query->where('carrier_id', $carrierId);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofOwner(Builder $query, string $ownerId): void
    {
        $query->where('owner_id', $ownerId);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function undelivered(Builder $query): void
    {
        $query->whereNull('delivered_at');
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function newestFirst(Builder $query): void
    {
        $query->orderByDesc('created_at');
    }
}
