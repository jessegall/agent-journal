<?php

declare(strict_types=1);

namespace App\Sessions\Enums;

/**
 * How far a start's driver has come to a verified conversation: only a ready one is given its held messages.
 */
enum StartReadiness: string
{
    case Accepted = 'accepted';
    case PreparingIdentity = 'preparing_identity';
    case Ready = 'ready';
    case Refused = 'refused';
    case Uncertain = 'uncertain';
    case Cancelled = 'cancelled';

    /**
     * Whether messages sent to the start wait until its conversation is verified.
     */
    public function shouldHoldDeliveries(): bool
    {
        return $this !== self::Ready;
    }

    /**
     * Whether a report of its bootstrap still changes it; a refused or cancelled start takes none, so a ready report
     * that arrives after Cancel binds nothing and keeps no mode.
     */
    public function takesReadiness(): bool
    {
        return $this !== self::Refused && $this !== self::Cancelled;
    }

    /**
     * Whether the start's conversation is still unproven while a report could still prove it: Check status has
     * something to check.
     */
    public function isUnverified(): bool
    {
        return $this->shouldHoldDeliveries() && $this->takesReadiness();
    }

    /**
     * The state a live session shows while this start has not proved its conversation; none once it no longer waits.
     */
    public function verificationState(): SessionActivityStatus|null
    {
        return match ($this) {
            self::Accepted, self::PreparingIdentity => SessionActivityStatus::Verifying,
            self::Uncertain => SessionActivityStatus::Unverified,
            self::Ready, self::Refused, self::Cancelled => null,
        };
    }
}
