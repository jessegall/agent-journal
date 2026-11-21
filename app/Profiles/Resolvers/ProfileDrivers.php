<?php

declare(strict_types=1);

namespace App\Profiles\Resolvers;

use App\Agents\Values\ModelSelection;
use App\Agents\Values\ProfileDefaults;
use App\Agents\Values\SelectedDriver;
use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Contracts\ProfileSelections;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ProfileSelection;

/**
 * Selects the driver, model and default variant of a start from the profile's current revision through Core's SelectedDriver,
 * which records the profile key and revision as the selection's source.
 */
final readonly class ProfileDrivers implements ProfileSelections
{
    public function __construct(private ProfileResolver $profiles) {}

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
            SelectedDriver::resolve($driverKey, $requested, $defaults, $parentDriver),
            $snapshot->base,
            $snapshot->revision,
            $start,
            $snapshot->authorization,
            $defaults,
            $snapshot->instances,
        );
    }
}
