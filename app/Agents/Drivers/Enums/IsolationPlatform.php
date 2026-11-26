<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Enums;

/**
 * Where a driver's tools run, as its protection is judged: a host's own system, or the agent image on the agent
 * daemon, under the standard or the protected-account start profile.
 */
enum IsolationPlatform: string
{
    case Darwin = 'darwin';
    case Linux = 'linux';
    case Container = 'linux-container';
    case ProtectedContainer = 'linux-container-protected';
    case Other = 'other';

    /**
     * Whether the platform is the agent image, whose evidence is kept per image digest.
     */
    public function isContainer(): bool
    {
        return $this === self::Container || $this === self::ProtectedContainer;
    }
}
