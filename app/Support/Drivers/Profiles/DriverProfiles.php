<?php

declare(strict_types=1);

namespace App\Support\Drivers\Profiles;

use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Drivers\DriverProfile;
use App\Exceptions\DriverFamilyUnknown;
use App\Models\Agents\AgentRuntime;
use App\Values\DriverKey;

/**
 * The profile of each driver the journal starts itself, found by the family of a runtime's driver.
 */
final readonly class DriverProfiles
{
    public function __construct(
        private DriverCatalogue $drivers,
        private ClaudeCodeProfile $claudeCode,
        private CodexProfile $codex,
    ) {}

    /**
     * @throws DriverFamilyUnknown
     */
    public function of(AgentRuntime $runtime): DriverProfile
    {
        $driver = $this->drivers->forKey(DriverKey::from($runtime->driver_key));

        return $this->ofFamily($driver->descriptor()->family);
    }

    /**
     * @throws DriverFamilyUnknown
     */
    public function ofFamily(string $family): DriverProfile
    {
        $profiles = [$this->claudeCode, $this->codex];

        return array_find($profiles, fn (DriverProfile $profile) => $profile->family() === $family)
            ?? throw DriverFamilyUnknown::for($family);
    }
}
