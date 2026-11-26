<?php

declare(strict_types=1);

namespace App\Data\Connections;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * The drivers a connected machine's installer seals beside the journal-agent release, as the journal serves them.
 */
final class DriverInstallListData extends Data
{
    /**
     * @param  list<InstallDriverData>  $drivers
     */
    public function __construct(
        #[DataCollectionOf(InstallDriverData::class)]
        public readonly array $drivers,
    ) {}
}
