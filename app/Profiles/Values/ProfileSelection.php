<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Agents\Support\SelectedProgram;

/**
 * What a launch from a profile is: the program and model selected for it, the profile's type, and the launch policy
 * of the revision it was selected from.
 */
final readonly class ProfileSelection
{
    public function __construct(
        public SelectedProgram $selection,
        public ProfileBase $base,
        public ProfileLaunchPolicy $launch,
    ) {}
}
