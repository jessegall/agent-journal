<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Skills;

use App\Agents\Drivers\Setup\DriverProfiles;
use App\Agents\Exceptions\DriverSkillsUnsupported;
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

    public function __construct(DriverProfiles $profiles)
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
}
