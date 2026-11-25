<?php

declare(strict_types=1);

namespace Tests\Fixtures\ScopeIndexes;

use Illuminate\Database\Eloquent\Collection;

/**
 * Two queries of parcels: one by carrier that no index serves, one by owner that the owner index serves.
 */
final class ParcelQueue
{
    /**
     * @return Collection<int, Parcel>
     */
    public function waitingFor(string $carrierId): Collection
    {
        return Parcel::query()->ofCarrier($carrierId)->undelivered()->newestFirst()->get();
    }

    /**
     * @return Collection<int, Parcel>
     */
    public function ownedBy(string $ownerId): Collection
    {
        return Parcel::query()->ofOwner($ownerId)->newestFirst()->get();
    }
}
