<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Agents\Enums\AgentRole;
use App\Agents\Support\SelectedProgram;
use App\Profiles\Enums\ProfileType;

/**
 * What a launch from a profile is: the program and model selected for it, the profile's type and the Core role it
 * runs as, and the launch policy of the revision it was selected from.
 */
final readonly class ProfileSelection
{
    public function __construct(
        public SelectedProgram $selection,
        public ProfileType $type,
        public AgentRole $role,
        public ProfileLaunchPolicy $launch,
    ) {}
}
