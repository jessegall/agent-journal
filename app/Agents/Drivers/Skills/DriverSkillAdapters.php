<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Skills;

use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\Setup\DriverProfiles;
use App\Agents\Exceptions\DriverSkillsUnsupported;
use App\Agents\StartDriver;
use App\Models\Agents\AgentSession;
use App\Skills\Contracts\DriverSkills;
use App\Values\DriverKey;

/**
 * The skill adapter of each driver the journal can hand skills to.
 */
final readonly class DriverSkillAdapters
{
    /**
     * @var array<string, DriverSkills>
     */
    private array $adapters;

    public function __construct(DriverProfiles $profiles, private DriverCatalogue $drivers)
    {
        $adapters = [];

        foreach ($profiles->all() as $profile) {
            $skills = $profile->skills();
            $adapters[$skills->skillProtocol()] = $skills;
        }

        $this->adapters = $adapters;
    }

    /**
     * @throws DriverSkillsUnsupported for a skill protocol no adapter writes
     */
    public function for(DriverKey $protocol): DriverSkills
    {
        return $this->adapters[$protocol->key] ?? throw DriverSkillsUnsupported::for($protocol);
    }

    public function supports(DriverKey $protocol): bool
    {
        return array_key_exists($protocol->key, $this->adapters);
    }

    /**
     * Whether the driver the session started with is registered with a skill protocol an adapter writes.
     */
    public function supportsSession(AgentSession $session): bool
    {
        $protocol = $this->protocolOf($session);

        return $protocol !== null && $this->supports($protocol);
    }

    /**
     * The adapter of the driver the session started with.
     *
     * @throws DriverSkillsUnsupported for a session whose driver has no skill adapter
     */
    public function forSession(AgentSession $session): DriverSkills
    {
        $protocol = $this->protocolOf($session)
            ?? throw DriverSkillsUnsupported::forNamed((string) $session->driver_key);

        return $this->for($protocol);
    }

    private function protocolOf(AgentSession $session): DriverKey|null
    {
        $family = StartDriver::of($session->driver_key, $this->drivers)->driver;

        if ($family === null || ! $this->drivers->hasFamily($family->key)) {
            return null;
        }

        return DriverKey::from($this->drivers->registrationOfFamily($family->key)->skillProtocol);
    }
}
