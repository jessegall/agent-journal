<?php

declare(strict_types=1);

namespace App\Enums\Projects;

/**
 * Which hosts a host route admits, named on its middleware as journal.host:<role>: enrolled hosts, the relays of
 * connected folders, or both, a relay then scoped to its live binding.
 */
enum HostRouteRole: string
{
    case Enrolled = 'enrolled';
    case Relay = 'relay';
    case Shared = 'shared';

    public function isForEnrolledHosts(): bool
    {
        return $this !== self::Relay;
    }

    public function isForRelays(): bool
    {
        return $this !== self::Enrolled;
    }
}
