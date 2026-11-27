<?php

declare(strict_types=1);

namespace App\Agents;

use App\Agents\Exceptions\ManifestRefused;
use App\Hosts\Protocol\Data\HostSecurityOptionsData;

/**
 * The seccomp and AppArmor profiles a helper container runs under, each a profile name or a path in the profiles
 * folder the journal names (agents.security_profiles), empty when not set; the host passes each as one --security-opt.
 */
final readonly class SecurityOptions
{
    private const string AGENT_SECCOMP_PROFILE = 'seccomp-agent.json';

    private function __construct(
        public string $seccomp,
        public string $apparmor,
    ) {}

    public function protocolData(): HostSecurityOptionsData
    {
        return HostSecurityOptionsData::from(['seccomp' => $this->seccomp, 'apparmor' => $this->apparmor]);
    }

    public static function none(): self
    {
        return new self('', '');
    }

    /**
     * The seccomp profile every agent container runs under.
     *
     * @throws ManifestRefused
     */
    public static function agent(string $profilesFolder): self
    {
        return self::make("{$profilesFolder}/".self::AGENT_SECCOMP_PROFILE, '', $profilesFolder);
    }

    /**
     * @throws ManifestRefused
     */
    public static function make(string $seccomp, string $apparmor, string $profilesFolder): self
    {
        foreach ([
            $seccomp,
            $apparmor,
        ] as $profile) {
            self::assertPlain($profile, $profilesFolder);
        }

        return new self($seccomp, $apparmor);
    }

    /**
     * @throws ManifestRefused
     */
    private static function assertPlain(string $profile, string $profilesFolder): void
    {
        if ($profile === '') {
            return;
        }

        if (strpbrk($profile, ",\n") !== false) {
            throw ManifestRefused::because('a security profile is one value, with no comma or newline');
        }

        if (str_starts_with($profile, '/') && ($profilesFolder === '' || ! self::isInside($profile, $profilesFolder))) {
            throw ManifestRefused::because('a security profile path lies outside the profiles folder');
        }
    }

    private static function isInside(string $path, string $folder): bool
    {
        return str_starts_with($path, rtrim($folder, '/').'/') && ! in_array('..', explode('/', $path), true);
    }
}
