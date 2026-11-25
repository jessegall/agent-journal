<?php

declare(strict_types=1);

namespace Tests\Fixtures\AccessorReads;

/**
 * A class that reads a parcel's accessor by its camel case name, which is refused, and by its snake case name, which
 * passes.
 */
final readonly class ParcelDesk
{
    public function shown(Parcel $parcel): string
    {
        return $parcel->trackingLabel.' '.$parcel->tracking_label;
    }
}
