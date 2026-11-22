<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\DriverCatalogue;
use App\Enums\DriverVariant;
use App\Enums\ModeSourceType;
use App\Exceptions\DriverCapabilityUnsupported;
use App\Models\Agent;
use App\Values\DriverRegistration;
use App\Values\ModelSelection;
use App\Values\ProfileDefaults;
use App\Values\SelectedDriver;
use App\Values\StartPreview;

/**
 * Resolves a start before it is committed, family and mode apart: the family as SelectedDriver chooses it, the mode
 * named, else the agent's saved one, else the profile's, unless the family runs one mode only. A mode that cannot run
 * here is shown with its reason, never swapped for another.
 */
final readonly class StartPreviews
{
    public function __construct(private DriverCatalogue $drivers) {}

    public function preview(
        Agent $agent,
        string|null $family,
        DriverVariant|null $mode,
        ModelSelection $model,
        ProfileDefaults $profile,
        string|null $parentFamily,
    ): StartPreview {
        $selection = SelectedDriver::resolve($family, $model, $profile, $parentFamily, $this->drivers);
        $offered = $this->modesOf($selection->driver);
        [$chosen, $source] = $this->modeOf($agent, $mode, $profile, $offered);
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
     * @param  list<DriverVariant>  $offered
     * @return array{0: DriverVariant, 1: ModeSourceType}
     */
    private function modeOf(Agent $agent, DriverVariant|null $mode, ProfileDefaults $profile, array $offered): array
    {
        if ($mode !== null) {
            return [$mode, ModeSourceType::Explicit];
        }

        if (count($offered) === 1) {
            return [$offered[0], ModeSourceType::OnlyMode];
        }

        if ($agent->mode_preference !== null) {
            return [$agent->mode_preference, ModeSourceType::Saved];
        }

        return [$profile->defaultVariant, ModeSourceType::Profile];
    }

    /**
     * @param  list<DriverVariant>  $offered
     */
    private function unavailableReason(string $family, DriverVariant $mode, array $offered): string|null
    {
        if (! in_array($mode, $offered, true)) {
            return "{$this->drivers->family($family)->label} does not run {$mode->value}.";
        }

        try {
            $this->drivers->pinned($family, $mode);
        } catch (DriverCapabilityUnsupported $unsupported) {
            return $unsupported->reason;
        }

        return null;
    }

    /**
     * @return list<DriverVariant>
     */
    private function modesOf(string $family): array
    {
        return array_values(array_map(
            fn (DriverRegistration $registration) => $registration->mode,
            array_filter(
                $this->drivers->catalogue(),
                fn (DriverRegistration $registration) => $registration->family === $family,
            ),
        ));
    }
}
