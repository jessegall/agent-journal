<?php

declare(strict_types=1);

namespace App\Enums\Drivers;

use App\Enums\Sessions\HostRefusal;
use App\Enums\Sessions\StartRefusalType;

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
    // The host keeps no ready report for the runtime's start, so Check status has nothing to send again.
    case NoObservation = 'no_observation';
    // The account's sign-in check found no sign-in by a method the journal accepts in its folder.
    case NotSignedIn = 'not-signed-in';
    // The start names no conversation for a turn to continue.
    case ConversationUnknown = 'conversation-unknown';
    case Unknown = 'unknown';

    /**
     * Whether the runtime cannot go on without someone looking at it: an account no longer signed in, or a start that
     * names no conversation to continue.
     */
    public function needsAttention(): bool
    {
        return $this === self::NotSignedIn || $this === self::ConversationUnknown;
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
            self::NotSignedIn => HostRefusal::NotSignedIn,
            self::ConversationUnknown => HostRefusal::ConversationUnknown,
            // no_observation answers Check status, never a start, so on a start's wake it is no reason the start knows
            self::NoObservation, self::Unknown => HostRefusal::Unknown,
        };
    }
}
