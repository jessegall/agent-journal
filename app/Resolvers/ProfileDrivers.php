<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Sessions\ProfileResolver;
use App\Contracts\Sessions\ProfileSelections;
use App\Values\ModelSelection;
use App\Values\ProfileDefaults;
use App\Values\ProfileKey;
use App\Values\ProfileSelection;
use App\Values\SelectedDriver;

/**
 * Selects the driver, model and default variant of a start from the profile's current revision through Core's SelectedDriver,
 * which records the profile key and revision as the selection's source.
 */
final readonly class ProfileDrivers implements ProfileSelections
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
            $start->driver,
            $start->driverPinned,
            $snapshot->model,
            $start->allowedModels,
            $snapshot->base->defaultVariant,
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
