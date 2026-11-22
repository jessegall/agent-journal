<?php

declare(strict_types=1);

namespace App\Drivers\Contracts;

use App\Agents\Enums\DriverVariant;
use App\Drivers\Enums\DriverCapability;
use App\Drivers\Values\DriverKey;
use App\Drivers\Values\DriverRegistration;
use App\Drivers\Values\PinnedDriver;

/**
 * The drivers this journal can start: a lookup by key is the only way one is selected.
 */
interface DriverCatalogue
{
    public function forKey(DriverKey $key): Driver;

    /**
     * The key of the one driver registered for a family in a mode, as a start form or the command line names it.
     */
    public function keyFor(string $family, DriverVariant $mode): DriverKey;

    /**
     * The registration a start of the family in the mode runs on, refused before anything is accepted when the driver
     * cannot do what every profile on it needs, such as the Codex terminal before it is proven.
     */
    /**
     * @param  list<DriverCapability>  $neededCapabilities  what this start needs of the driver beyond its profiles' requirements
     */
    public function pinned(string $family, DriverVariant $mode, array $neededCapabilities = []): PinnedDriver;

    /**
     * @return list<DriverRegistration>
     */
    public function catalogue(): array;

    /**
     * The catalogue's revision, which rises with every registration, so a choice made against an older one can be told.
     */
    public function revision(): int;
}
