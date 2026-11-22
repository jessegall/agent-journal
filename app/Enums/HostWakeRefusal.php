<?php

declare(strict_types=1);

namespace App\Enums;

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
    case PinnedBuildMissing = 'pinned-build-missing';
    case Unknown = 'unknown';

    /**
     * The reason a host's report names, or unknown when the host named one outside the set.
     */
    public static function fromReport(string $reason): self
    {
        return self::tryFrom($reason) ?? self::Unknown;
    }

    /**
     * The start refusal this host reason is kept as on the start's receipt, so it reads in the refusal's own words.
     */
    public function startReason(): StartRefusalType|HostRefusal
    {
        return match ($this) {
            self::ContainerUnavailable => StartRefusalType::ContainerUnavailable,
            self::ImageUnverified => StartRefusalType::ImageUnverified,
            self::CapacityUnavailable => StartRefusalType::CapacityUnavailable,
            self::ProtectedAccountFolderRejected => HostRefusal::AccountFolderRejected,
            self::PinnedBuildMissing => HostRefusal::PinnedBuildMissing,
            self::Unknown => HostRefusal::Unknown,
        };
    }
}
