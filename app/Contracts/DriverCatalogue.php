<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Enums\DriverCapability;
use App\Enums\DriverVariant;
use App\Values\DriverFamily;
use App\Values\DriverKey;
use App\Values\DriverRegistration;
use App\Values\PinnedDriver;

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
     *
     * @param  list<DriverCapability>  $neededCapabilities  what this start needs of the driver beyond its profiles' requirements
     */
    public function pinned(string $family, DriverVariant $mode, array $neededCapabilities = []): PinnedDriver;

    /**
     * @return list<DriverRegistration>
     */
    public function catalogue(): array;

    public function hasFamily(string $key): bool;

    /**
     * The family registered under the key, such as claude-code.
     */
    public function family(string $key): DriverFamily;

    /**
     * @return list<DriverFamily>
     */
    public function families(): array;

    /**
     * The keys of every registered family, such as claude-code and codex.
     *
     * @return list<string>
     */
    public function familyKeys(): array;

    /**
     * The catalogue's revision, which rises with every registration, so a choice made against an older one can be told.
     */
    public function revision(): int;
}
