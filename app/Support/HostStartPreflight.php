<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Sessions\StartPreflight;
use App\Enums\DriverCapability;
use App\Enums\StartPreflightRefusal;
use App\Exceptions\StartPreflightRefused;
use App\Models\Host;
use App\Values\BoundTarget;
use App\Values\StartProposal;

/**
 * Whether a proposed start can run, answered on the server before anything stops or a grant is allocated: the
 * profile's pinned driver and allowed models, and a connected host that speaks this protocol and declared the
 * driver, build, placement and variant. Admission, Switch and Home ask it alike.
 */
final readonly class HostStartPreflight implements StartPreflight
{
    public function __construct(private DriverCatalogue $drivers) {}

    public function refusals(StartProposal $proposal): array
    {
        $refusals = [];

        if ($proposal->isDriverPinnedAway()) {
            $refusals[] = StartPreflightRefusal::DriverPinned;
        }

        if ($proposal->isModelRefused()) {
            $refusals[] = StartPreflightRefusal::ModelNotAllowed;
        }

        if ($proposal->isContained() && ! $this->runsContained($proposal)) {
            return [...$refusals, StartPreflightRefusal::DriverNotContainable];
        }

        return [...$refusals, ...$this->hostRefusals($proposal)];
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
        $key = $this->drivers->keyFor($proposal->driver, $proposal->variant);

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
        $hosts = array_filter(Host::servingEnrolled(), fn (Host $host) => $host->runsPlacement($proposal->placement));

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
