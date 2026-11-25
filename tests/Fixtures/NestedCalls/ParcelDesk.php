<?php

declare(strict_types=1);

namespace Tests\Fixtures\NestedCalls;

/**
 * Calls nested the ways the nested call check refuses, beside the ways it lets through.
 */
final class ParcelDesk
{
    public function shipNested(string $id): void
    {
        $this->ship(Parcel::query()->findOrFail($id));
    }

    public function labelNested(string $id): void
    {
        Parcel::lookUp($id)?->label();
    }

    public function shipBound(string $id): void
    {
        $parcel = Parcel::query()->findOrFail($id);
        $this->ship($parcel);
    }

    public function filterBySubquery(): void
    {
        $this->narrow(Parcel::query()->where('open', true));
    }
}
