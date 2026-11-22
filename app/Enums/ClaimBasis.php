<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * The shape of the proof behind a claim: a seat at the inbox's desk, a seat at the desk that holds the run's task, or
 * the task held by the claimant itself.
 */
enum ClaimBasis: string
{
    case Inbox = 'inbox';
    case DeskRun = 'desk-run';
    case DirectRun = 'direct-run';

    /**
     * Whether the claim stands on a seat assignment.
     */
    public function needsParticipation(): bool
    {
        return $this !== self::DirectRun;
    }

    /**
     * Whether the claim stands on the assignment of the work it runs.
     */
    public function needsWork(): bool
    {
        return $this !== self::Inbox;
    }

    /**
     * Whether the claimant itself must hold that work, rather than the desk it sits at.
     */
    public function needsClaimantToHoldWork(): bool
    {
        return $this === self::DirectRun;
    }
}
