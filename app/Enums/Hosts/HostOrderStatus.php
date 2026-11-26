<?php

declare(strict_types=1);

namespace App\Enums\Hosts;

/**
 * Where an order to a host stands: waiting, handed out, carried out, or refused.
 */
enum HostOrderStatus: string
{
    case Pending = 'pending';
    case Claimed = 'claimed';
    case Done = 'done';
    case Refused = 'refused';
}
