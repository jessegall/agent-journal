<?php

declare(strict_types=1);

namespace App\Agents\Enums;

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

    /**
     * Whether messages sent to the start wait until its conversation is verified.
     */
    public function holdsDeliveries(): bool
    {
        return $this !== self::Ready;
    }

    /**
     * Whether a report of its bootstrap still changes it; a refused start takes none.
     */
    public function takesReadiness(): bool
    {
        return $this !== self::Refused;
    }
}
