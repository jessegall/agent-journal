<?php

declare(strict_types=1);

namespace App\Agents;

use App\Agents\Exceptions\ManifestRefused;

/**
 * The seccomp and AppArmor profiles a helper container runs under, each a profile name or a path in the profiles
 * folder the journal names (agents.security_profiles), both optional. The host passes each as one --security-opt.
 */
final readonly class SecurityOptions
{
    private function __construct(
        public string|null $seccomp,
        public string|null $apparmor,
    ) {}

    public static function none(): self
    {
        return new self(null, null);
    }

    /**
     * @throws ManifestRefused
     */
    public static function make(string|null $seccomp, string|null $apparmor, string $profilesFolder): self
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
    private static function assertPlain(string|null $profile, string $profilesFolder): void
    {
        if ($profile === null) {
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
