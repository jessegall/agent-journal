<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Sessions\StartPreflight as StartPreflightContract;
use App\Enums\Drivers\DriverCapability;
use App\Enums\Sessions\StartPreflightRefusal;
use App\Exceptions\StartPreflightRefused;
use App\Models\Projects\Host;
use App\Values\BoundTarget;
use App\Values\StartProposal;

/**
 * Whether a proposed start can run, answered on the server before anything stops or a grant is allocated: a connected
 * host that speaks this protocol and declared the driver, build, placement and driver type. Admission, Switch and Home
 * ask it alike; a profile only prefers a driver and a model, so it refuses none.
 */
final readonly class StartPreflight implements StartPreflightContract
{
    public function __construct(private DriverCatalogue $drivers) {}

    public function refusals(StartProposal $proposal): array
    {
        if ($proposal->isContained() && ! $this->runsContained($proposal)) {
            return [StartPreflightRefusal::DriverNotContainable];
        }

        return $this->hostRefusals($proposal);
    }

    public function assertAdmitted(StartProposal $proposal): void
    {
        foreach ($this->refusals($proposal) as $refusal) {
            throw StartPreflightRefused::because($refusal);
        }
    }

    /**
     * Whether the proposed driver's capabilities let it run in a container.
     */
    private function runsContained(StartProposal $proposal): bool
    {
        $key = $this->drivers->keyFor($proposal->driver, $proposal->driverType);

        return $this->drivers->forKey($key)
            ->capabilities(BoundTarget::beforePlacement())
            ->supportOf(DriverCapability::RunContained)
            ->isAllowed();
    }

    /**
     * @return list<StartPreflightRefusal>
     */
    private function hostRefusals(StartProposal $proposal): array
    {
        $hosts = array_filter(Host::findServingEnrolled(), fn (Host $host) => $host->runsPlacement($proposal->placement));

        if ($hosts === []) {
            return [StartPreflightRefusal::NoHost];
        }

        foreach ($hosts as $host) {
            if ($host->declares($proposal)) {
                return [];
            }
        }

        return [StartPreflightRefusal::CombinationNotDeclared];
    }
}
