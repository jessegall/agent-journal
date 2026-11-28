<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Setup;

use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\Contracts\PinnedBuilds;
use App\Agents\Drivers\Hooks\HookReplies;
use App\Agents\Exceptions\DriverSetupInvalid;
use App\Agents\SignInEgress;
use App\Exceptions\DriverFamilyUnknown;
use App\Files\Contracts\Files;
use App\Models\Agents\AgentRuntime;
use Illuminate\Contracts\Container\Container;

/**
 * The profile of each driver family the catalogue holds, one per setup.
 */
final readonly class DriverProfiles
{
    /**
     * @var array<string, DriverProfile>
     */
    private array $profiles;

    /**
     * @param  list<DriverSetup>  $setups
     *
     * @throws DriverSetupInvalid
     */
    public function __construct(
        Container $container,
        private DriverCatalogue $drivers,
        PinnedBuilds $builds,
        HookReplies $replies,
        Files $files,
        SignInEgress $egress,
        array $setups,
    ) {
        $profiles = [];

        foreach ($setups as $setup) {
            if (array_key_exists($setup->family, $profiles)) {
                throw DriverSetupInvalid::twice($setup->family);
            }

            $profiles[$setup->family] = new DriverProfile($setup, $container, $builds, $replies, $files, $egress);
        }

        foreach ($drivers->familyKeys() as $family) {
            if (! array_key_exists($family, $profiles)) {
                throw DriverSetupInvalid::missingFamily($family);
            }
        }

        $this->profiles = $profiles;
    }

    /**
     * @throws DriverFamilyUnknown
     */
    public function of(AgentRuntime $runtime): DriverProfile
    {
        $driver = $this->drivers->forRuntime($runtime);

        return $this->ofFamily($driver->descriptor()->family);
    }

    /**
     * Every driver's profile, in the order the setups were declared.
     *
     * @return list<DriverProfile>
     */
    public function all(): array
    {
        return array_values($this->profiles);
    }

    /**
     * @throws DriverFamilyUnknown
     */
    public function ofFamily(string $family): DriverProfile
    {
        return $this->profiles[$family] ?? throw DriverFamilyUnknown::for($family);
    }
}
