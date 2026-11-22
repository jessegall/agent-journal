<?php

declare(strict_types=1);

namespace App\Communication\Enums;

/**
 * Where waking one recipient about one receipt stands: still trying, taken by its runtime, given up after too many
 * tries, or no longer wanted.
 */
enum ReceiptDeliveryState: string
{
    case Pending = 'pending';
    case Accepted = 'accepted';
    case Exhausted = 'exhausted';
    case Cancelled = 'cancelled';

    public function isPending(): bool
    {
        return $this === self::Pending;
    }
}
