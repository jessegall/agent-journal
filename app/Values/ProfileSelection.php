<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\DriverVariant;
use App\Enums\InstancePolicy;
use App\Support\Compatibility\DriverCompatibility;

/**
 * What a start from a profile is: the driver and model selected for it, the profile's type, the revision it was
 * selected from, that revision's start policy and its authorization.
 */
final readonly class ProfileSelection
{
    public function __construct(
        public SelectedDriver $selection,
        public ProfileBase $base,
        public int $revision,
        public ProfileStartPolicy $start,
        public ProfileAuthorization $authorization,
        public ProfileDefaults $defaults,
        public InstancePolicy $instances = InstancePolicy::Reusable,
    ) {}

    /**
     * The policy a start from this selection freezes: the revision's access, stop conditions and execution, with the
     * profile key, revision and configuration they came from.
     */
    /**
     * The start this selection proposes in the variant, on the driver's pinned build and the policy's placement.
     */
    public function proposal(DriverVariant $variant, string|null $model): StartProposal
    {
        $driver = $this->selection->driver;

        return new StartProposal(
            $this->defaults,
            $driver,
            DriverCompatibility::pinned($driver)->version,
            $variant,
            $this->startPolicy()->execution->mode,
            $model,
        );
    }

    public function startPolicy(): StartPolicy
    {
        $source = $this->selection->source;

        return $this->start->freeze($source->profileKey, $source->profileRevision);
    }
}
