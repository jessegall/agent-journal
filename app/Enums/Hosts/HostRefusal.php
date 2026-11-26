<?php

declare(strict_types=1);

namespace App\Enums\Hosts;

/**
 * Why a host did not carry out an order.
 */
enum HostRefusal: string
{
    case GuardMoved = 'guard_moved';
    case NotRunning = 'not_running';
    case Expired = 'expired';
    case Unsafe = 'unsafe';
    case HostRestarted = 'host_restarted';
    case Fenced = 'fenced';
}
