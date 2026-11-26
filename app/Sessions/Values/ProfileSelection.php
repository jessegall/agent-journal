<?php

declare(strict_types=1);

namespace App\Sessions\Values;

use App\Agents\Drivers\Enums\DriverType;
use App\Profiles\Data\ProfileAuthorization;
use App\Profiles\Enums\InstancePolicy;
use App\Support\Compatibility\DriverCompatibility;
use App\Values\ProfileBase;
use App\Values\ProfileStartPolicy;
use App\Values\SelectedDriver;

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
     * The start this selection proposes in the driver type, on the driver's pinned build and the policy's placement.
     */
    public function proposal(DriverType $driverType, string|null $model): StartProposal
    {
        $driver = $this->selection->driver;

        return new StartProposal(
            $this->defaults,
            $driver,
            DriverCompatibility::pinned($driver)->version,
            $driverType,
            $this->startPolicy()->execution->mode,
            $model,
        );
    }

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
