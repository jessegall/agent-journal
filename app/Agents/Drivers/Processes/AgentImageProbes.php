<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Processes;

use App\Agents\ContainerManifest;
use App\Agents\Exceptions\ManifestRefused;
use App\Agents\SecurityOptions;
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
    public function __construct(private string $securityProfiles) {}

    /**
     * The probe run in a throwaway container of the driver image the start froze: networkless, with no mounts.
     *
     * @throws ManifestRefused
     */
    public function inDriverImage(HostProcessPlan $probe, string $image): HostProcessPlan
    {
        return $probe->inContainer(ContainerManifest::probe($image, SecurityOptions::agent($this->securityProfiles)));
    }
}
