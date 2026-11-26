<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Processes;

use App\Agents\ContainerManifest;
use App\Agents\Exceptions\ManifestRefused;
use App\Agents\SecurityOptions;
use App\Support\AgentImage;
use App\Values\HostProcessPlan;

/**
 * Runs a probe of a driver, such as its build check, in a throwaway container of the agent image, as a contained
 * host runs every driver.
 */
final readonly class AgentImageProbes
{
    /**
     * @param  string  $securityProfiles  the folder on the agent host that holds the agent containers' profiles
     */
    public function __construct(private AgentImage $image, private string $securityProfiles) {}

    /**
     * The probe run in a throwaway container of the agent image.
     *
     * @throws ManifestRefused
     */
    public function inAgentImage(HostProcessPlan $probe): HostProcessPlan
    {
        return $probe->inContainer($this->probeContainer());
    }

    /**
     * @throws ManifestRefused
     */
    private function probeContainer(): ContainerManifest
    {
        return ContainerManifest::probe($this->image->reference, SecurityOptions::agent($this->securityProfiles));
    }
}
