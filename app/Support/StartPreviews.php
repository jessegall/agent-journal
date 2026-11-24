<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\DriverType;
use App\Enums\DriverTypeSource;
use App\Exceptions\DriverCapabilityUnsupported;
use App\Models\Agents\Agent;
use App\Values\DriverRegistration;
use App\Values\ModelSelection;
use App\Values\ProfileDefaults;
use App\Values\SelectedDriver;
use App\Values\StartPreview;

/**
 * Resolves a start before it is committed, family and driver type apart: the family as SelectedDriver chooses it, the driver type
 * named, else the agent's saved one, else the profile's, unless the family runs one driver type only. A driver type that cannot run
 * here is shown with its reason, never swapped for another.
 */
final readonly class StartPreviews
{
    public function __construct(private DriverCatalogue $drivers) {}

    public function preview(
        Agent $agent,
        string|null $family,
        DriverType|null $driverType,
        ModelSelection $model,
        ProfileDefaults $profile,
        string|null $parentFamily,
    ): StartPreview {
        $selection = SelectedDriver::resolve($family, $model, $profile, $parentFamily, $this->drivers);
        $offered = $this->driverTypesOf($selection->driver);

        [$chosen, $source] = $this->chosenDriverType(
            $agent,
            $selection->driver,
            $driverType,
            $profile->defaultDriverType,
        );

        $label = $this->drivers->family($selection->driver)->label;

        return new StartPreview(
            $selection,
            $chosen,
            $source,
            in_array($chosen, $offered, true) ? (string) $this->drivers->keyFor($selection->driver, $chosen) : null,
            "{$label} {$chosen->value}",
            $this->unavailableReason($selection->driver, $chosen, $offered),
            count($offered) === 1,
            $this->drivers->revision(),
        );
    }

    /**
     * The driver type a start of the agent in this family runs, and where it came from: named, else the only one the family
     * runs, else the agent's saved one, else the profile's. Every start resolves its driver type here.
     *
     * @return array{0: DriverType, 1: DriverTypeSource}
     */
    public function chosenDriverType(
        Agent $agent,
        string $family,
        DriverType|null $driverType,
        DriverType $profileDefault,
    ): array {
        $offered = $this->driverTypesOf($family);

        if ($driverType !== null) {
            return [$driverType, DriverTypeSource::Explicit];
        }

        if (count($offered) === 1) {
            return [$offered[0], DriverTypeSource::OnlyType];
        }

        if ($agent->driver_type_preference !== null) {
            return [$agent->driver_type_preference, DriverTypeSource::Saved];
        }

        return [$profileDefault, DriverTypeSource::Profile];
    }

    /**
     * @param  list<DriverType>  $offered
     */
    private function unavailableReason(string $family, DriverType $driverType, array $offered): string|null
    {
        if (! in_array($driverType, $offered, true)) {
            return "{$this->drivers->family($family)->label} does not run {$driverType->value}.";
        }

        try {
            $this->drivers->pinned($family, $driverType);
        } catch (DriverCapabilityUnsupported $unsupported) {
            return $unsupported->reason;
        }

        return null;
    }

    /**
     * @return list<DriverType>
     */
    private function driverTypesOf(string $family): array
    {
        return array_values(array_map(
            fn (DriverRegistration $registration) => $registration->driverType,
            array_filter(
                $this->drivers->catalogue(),
                fn (DriverRegistration $registration) => $registration->family === $family,
            ),
        ));
    }
}
