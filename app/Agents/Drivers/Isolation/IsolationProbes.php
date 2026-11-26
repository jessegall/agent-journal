<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Isolation;

use App\Agents\ContainerManifest;
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

    private const string SECCOMP_PROFILE = 'seccomp-agent.json';

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
     * @param  list<string>  $argv
     */
    private function planOf(HostProcessPurpose $purpose, array $argv): HostProcessPlan
    {
        $seccomp = "{$this->securityProfiles}/".self::SECCOMP_PROFILE;
        $security = SecurityOptions::make($seccomp, null, $this->securityProfiles);

        return new HostProcessPlan(
            purpose: $purpose,
            type: HostProcessType::Pipe,
            restart: RestartPolicy::Never,
            argv: $argv,
            environment: [],
            folder: ContainerManifest::WORKDIR,
            container: ContainerManifest::probe($this->image->reference, $security),
        );
    }
}
