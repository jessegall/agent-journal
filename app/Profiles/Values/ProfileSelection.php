<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Agents\Values\SelectedProgram;
use App\Agents\Values\StartPolicy;
use App\Profiles\Enums\InstancePolicy;

/**
 * What a start from a profile is: the program and model selected for it, the profile's type, the revision it was
 * selected from, that revision's start policy and its authorization.
 */
final readonly class ProfileSelection
{
    public function __construct(
        public SelectedProgram $selection,
        public ProfileBase $base,
        public int $revision,
        public ProfileStartPolicy $start,
        public ProfileAuthorization $authorization,
        public InstancePolicy $instances = InstancePolicy::Reusable,
    ) {}

    /**
     * The policy a start from this selection freezes: the revision's access, stop conditions and execution, with the
     * profile key, revision and configuration they came from.
     */
    public function startPolicy(): StartPolicy
    {
        $source = $this->selection->source;

        return $this->start->freeze($source->profileKey, $source->profileRevision);
    }
}
