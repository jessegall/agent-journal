<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * What a run claim stands on: the claimant holding the work itself, or the claimant attached to the inbox that holds
 * the work.
 */
enum ClaimBasis: string
{
    case InboxRun = 'inbox-run';
    case DirectRun = 'direct-run';

    /**
     * Whether the claim stands on the claimant's membership of the inbox holding the work.
     */
    public function needsMembership(): bool
    {
        return $this === self::InboxRun;
    }

    /**
     * Whether the claimant itself must hold that work, rather than the inbox it is attached to.
     */
    public function needsClaimantToHoldWork(): bool
    {
        return $this === self::DirectRun;
    }
}
