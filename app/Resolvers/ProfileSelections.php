<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Sessions\Contracts\ProfileResolver;
use App\Sessions\Contracts\ProfileSelections as ProfileSelectionsContract;
use App\Sessions\Values\ProfileDefaults;
use App\Sessions\Values\ProfileSelection;
use App\Values\ModelSelection;
use App\Values\ProfileKey;
use App\Values\SelectedDriver;

/**
 * Selects the driver, model and default driver type of a start from the profile's current revision through Core's SelectedDriver,
 * which records the profile key and revision as the selection's source.
 */
final readonly class ProfileSelections implements ProfileSelectionsContract
{
    public function __construct(private ProfileResolver $profiles, private DriverCatalogue $drivers) {}

    public function select(
        ProfileKey $profile,
        ModelSelection $requested,
        string|null $driverKey,
        string|null $parentDriver,
    ): ProfileSelection {
        $snapshot = $this->profiles->snapshotFor($profile);
        $start = $snapshot->start;

        $defaults = new ProfileDefaults(
            $profile->key,
            $snapshot->revision,
            $start->preferredDriver,
            $snapshot->preferredTier,
            $snapshot->base->defaultDriverType,
        );

        return new ProfileSelection(
            SelectedDriver::resolve($driverKey, $requested, $defaults, $parentDriver, $this->drivers),
            $snapshot->base,
            $snapshot->revision,
            $start,
            $snapshot->authorization,
            $defaults,
            $snapshot->instances,
        );
    }
}
