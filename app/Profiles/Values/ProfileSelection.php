<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Agents\Support\SelectedProgram;

/**
 * What a start from a profile is: the program and model selected for it, the profile's type, and the start policy
 * of the revision it was selected from.
 */
final readonly class ProfileSelection
{
    public function __construct(
        public SelectedProgram $selection,
        public ProfileBase $base,
        public ProfileStartPolicy $start,
    ) {}
}
