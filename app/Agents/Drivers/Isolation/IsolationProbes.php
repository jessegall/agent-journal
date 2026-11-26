<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Isolation;

use App\Agents\ContainerManifest;
use App\Agents\Exceptions\ManifestRefused;
use App\Agents\SecurityOptions;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\Enums\HostProcessType;
use App\Hosts\Enums\RestartPolicy;
use App\Support\AgentImage;
use App\Values\HostProcessPlan;

/**
 * The throwaway checks that show whether Claude Code's sandbox runs in the agent image: socat, the relay it needs,
 * then bubblewrap with the namespaces it asks for, each in a container of the image under the agent containers'
 * seccomp profile, with no network and no mount.
 */
final readonly class IsolationProbes
{
    public const array SOCAT_ARGV = ['socat', '-V'];

    public const array SANDBOX_ARGV = [
        'bwrap',
        '--ro-bind',
        '/',
        '/',
        '--proc',
        '/proc',
        '--dev',
        '/dev',
        '--unshare-user',
        '--unshare-pid',
        '--unshare-net',
        '--new-session',
        '--die-with-parent',
        'true',
    ];

    /**
     * @param  string  $securityProfiles  the folder on the agent host that holds the agent containers' profiles
     */
    public function __construct(private AgentImage $image, private string $securityProfiles) {}

    public function socat(): HostProcessPlan
    {
        return $this->planOf(HostProcessPurpose::RelayProbe, self::SOCAT_ARGV);
    }

    public function sandbox(): HostProcessPlan
    {
        return $this->planOf(HostProcessPurpose::SandboxProbe, self::SANDBOX_ARGV);
    }

    /**
     * The image the probes run in, by which a verdict is kept.
     */
    public function image(): string
    {
        return $this->image->reference;
    }

    /**
     * The probe run in a throwaway container of the agent image, as a contained host runs every driver program.
     *
     * @throws ManifestRefused
     */
    public function inAgentImage(HostProcessPlan $probe): HostProcessPlan
    {
        return $probe->inContainer($this->probeContainer());
    }

    /**
     * @param  list<string>  $argv
     */
    private function planOf(HostProcessPurpose $purpose, array $argv): HostProcessPlan
    {

        return new HostProcessPlan(
            purpose: $purpose,
            type: HostProcessType::Pipe,
            restart: RestartPolicy::Never,
            argv: $argv,
            environment: [],
            folder: ContainerManifest::WORKDIR,
            container: $this->probeContainer(),
        );
    }

    /**
     * @throws ManifestRefused
     */
    private function probeContainer(): ContainerManifest
    {
        return ContainerManifest::probe($this->image->reference, SecurityOptions::agent($this->securityProfiles));
    }
}
