<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * How a helper container is started: the standard way, as one unprivileged user, or protected, where a root-owned
 * init starts the driver and the shell executor as two users and then drops its rights.
 */
enum LaunchProfileType: string
{
    case Standard = 'standard';
    case ProtectedAccount = 'protected-account';

    /**
     * The user the container starts as: the driver's own for a standard start, root for the init of a protected one.
     */
    public function user(): string
    {
        return match ($this) {
            self::Standard => '10001:10001',
            self::ProtectedAccount => '0:0',
        };
    }

    /**
     * The capabilities the container starts with: none for a standard start, only what the protected init needs to
     * start its two users and drop its own rights.
     *
     * @return list<string>
     */
    public function capabilities(): array
    {
        return match ($this) {
            self::Standard => [],
            self::ProtectedAccount => [
                'SETUID',
                'SETGID',
                'SETPCAP',
            ],
        };
    }

    /**
     * The platform a contained host's protection report names for starts of this profile: a protected start keeps
     * the account by its two users and the managed policy, not by the driver's own sandbox, so it has its own report.
     */
    public function protectionPlatform(): string
    {
        return match ($this) {
            self::Standard => 'linux-container',
            self::ProtectedAccount => 'linux-container-protected',
        };
    }

    /**
     * Whether the start is for an account folder: a protected start exists to keep that folder from the model.
     */
    public function isForAnAccount(): bool
    {
        return $this === self::ProtectedAccount;
    }
}
