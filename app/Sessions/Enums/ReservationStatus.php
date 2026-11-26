<?php

declare(strict_types=1);

namespace App\Sessions\Enums;

/**
 * Whether a start still holds its share of the host: reserved until its exit is confirmed, then released.
 */
enum ReservationStatus: string
{
    case Reserved = 'reserved';
    case Released = 'released';
}
