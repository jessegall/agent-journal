<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Agents\Support\SelectedProgram;
use App\Agents\Support\StartPolicy;

/**
 * What a start from a profile is: the program and model selected for it, the profile's type, the revision it was
 * selected from and that revision's start policy.
 */
final readonly class ProfileSelection
{
    public function __construct(
        public SelectedProgram $selection,
        public ProfileBase $base,
        public int $revision,
        public ProfileStartPolicy $start,
    ) {}

    /**
     * The policy a start from this selection freezes: the revision's access, stop conditions and execution, with the
     * profile key, revision and configuration they came from.
     */
    public function startPolicy(): StartPolicy
    {
        $source = $this->selection->source;

        return new StartPolicy(
            $this->start->access,
            $this->start->stopConditions,
            $this->start->execution,
            $source->profileKey,
            $source->profileRevision,
            $this->start->configurationHash(),
        );
    }
}
