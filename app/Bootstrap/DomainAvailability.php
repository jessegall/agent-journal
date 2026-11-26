<?php

declare(strict_types=1);

namespace App\Bootstrap;

use App\Bootstrap\Contracts\Domains\DomainAvailability as DomainAvailabilityContract;
use App\Bootstrap\Exceptions\DomainNotFound;
use App\Exceptions\SettingsUnavailable;
use App\Settings\Contracts\SettingsSnapshot;
use App\Settings\CurrentSettingsResolver;
use App\Settings\Declarations\ToggleGroup;
use App\Settings\DisabledSettingsGroup;
use App\Settings\Exceptions\SettingStorageInvalid;
use App\Settings\SettingRegistry;
use App\Support\DomainEntry;
use App\Support\DomainRegistry;

/**
 * Works out each owner's availability from one read of Core's settings: a switchable domain is available while its
 * switch is on and every domain it requires is available. It keeps nothing between calls.
 */
final readonly class DomainAvailability implements DomainAvailabilityContract
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
