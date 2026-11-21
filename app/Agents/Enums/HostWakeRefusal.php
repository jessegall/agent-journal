<?php

declare(strict_types=1);

namespace App\Agents\Enums;

/**
 * Why a host refused a request, from the closed set journal-agent may report (contracts.RefusalReason); a reason
 * outside it is kept as unknown, never as a guess.
 */
enum HostWakeRefusal: string
{
    case ContainerUnavailable = 'container-unavailable';
    case ImageUnverified = 'image-unverified';
    case CapacityUnavailable = 'capacity-unavailable';
    case ProtectedAccountFolderRejected = 'protected-account-folder-rejected';
    case Unknown = 'unknown';

    /**
     * The reason a host's report names, or unknown when the host named one outside the set.
     */
    public static function fromReport(string $reason): self
    {
        return self::tryFrom($reason) ?? self::Unknown;
    }
}
