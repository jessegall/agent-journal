<?php

declare(strict_types=1);

namespace App\Hosts\Enums;

/**
 * Where an order to a host stands: waiting, handed out, carried out, or refused.
 */
enum HostOrderStatus: string
{
    case Pending = 'pending';
    case Claimed = 'claimed';
    case Done = 'done';
    case Refused = 'refused';

    /**
     * Whether the order is still to be carried out: waiting or handed out.
     */
    public function isOpen(): bool
    {
        return match ($this) {
            self::Pending, self::Claimed => true,
            self::Done, self::Refused => false,
        };
    }
}
