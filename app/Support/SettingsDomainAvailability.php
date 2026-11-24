<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Domains\DomainAvailability;
use App\Contracts\Settings\SettingsSnapshot;
use App\Declarations\ToggleGroup;
use App\Exceptions\DomainNotFound;
use App\Exceptions\SettingStorageInvalid;
use App\Exceptions\SettingsUnavailable;

/**
 * Works out each owner's availability from one read of Core's settings: a switchable domain is available while its
 * switch is on and every domain it requires is available. It keeps nothing between calls.
 */
final readonly class SettingsDomainAvailability implements DomainAvailability
{
    public function __construct(
        private DomainRegistry $domains,
        private DomainSwitches $switches,
        private SettingRegistry $settings,
        private CurrentSettingsResolver $currentSettings,
    ) {}

    /**
     * @throws DomainNotFound
     * @throws SettingStorageInvalid
     * @throws SettingsUnavailable
     */
    public function isEnabled(string $owner): bool
    {
        return $this->status($owner)->isAvailable;
    }

    /**
     * The owner's switch and its availability, read from one Core snapshot for the whole walk of its requirements.
     *
     * @throws DomainNotFound
     * @throws SettingStorageInvalid
     * @throws SettingsUnavailable
     */
    public function status(string $owner): DomainStatus
    {
        if ($owner === SettingRegistry::CORE) {
            return new DomainStatus($owner, true, true, []);
        }

        return $this->statusIn(
            $this->currentSettings->resolver()->snapshot($this->settings->definition(SettingRegistry::CORE)),
            $this->domains->get($owner),
        );
    }

    private function statusIn(SettingsSnapshot $snapshot, DomainEntry $domain): DomainStatus
    {
        $switchedOn = $this->switches->of($domain->name)
            ->map(fn (ToggleGroup $switch) => ! $snapshot->group($switch) instanceof DisabledSettingsGroup)
            ->getOrElse(true);

        $unavailable = [];

        foreach ($domain->requires as $requiredClass) {
            $required = $this->statusIn($snapshot, $this->domains->get(DomainEntry::nameOf($requiredClass)));

            if (! $required->isAvailable) {
                $unavailable[] = $required->owner;
            }
        }

        return new DomainStatus($domain->name, $switchedOn, $switchedOn && $unavailable === [], $unavailable);
    }
}
